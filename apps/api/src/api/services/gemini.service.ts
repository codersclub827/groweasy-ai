import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from "@google/generative-ai";

import { apiEnv } from "../../config/env.js";
import { ApiError } from "../../lib/api-error.js";
import type { ValidCsvRow } from "../types/import.types.js";

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 500;

type GeminiBatchRequest = {
  batchIndex: number;
  columns: string[];
  rows: ValidCsvRow[];
};

export type GeminiBatchResponse = {
  rows: unknown[];
  skippedRows: unknown[];
};

function getGeminiClient() {
  if (!apiEnv.geminiApiKey) {
    throw ApiError.badRequest(
      "GEMINI_API_KEY is required for CRM mapping.",
      "GEMINI_API_KEY_MISSING"
    );
  }

  return new GoogleGenerativeAI(apiEnv.geminiApiKey);
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function shouldRetry(error: unknown) {
  if (error instanceof GoogleGenerativeAIFetchError) {
    return error.status === undefined || error.status === 429 || error.status >= 500;
  }

  return error instanceof Error;
}

function buildPrompt({ batchIndex, columns, rows }: GeminiBatchRequest) {
  const responseShape = {
    rows: [
      {
        rowIndex: 0,
        mappedFields: {
          firstName: null,
          lastName: null,
          email: null,
          phone: null,
          company: null,
          jobTitle: null,
          leadSource: null,
          leadStatus: null,
          website: null,
          city: null,
          state: null,
          country: null,
          countryCode: null,
          postalCode: null,
          address: null,
          notes: null
        },
        customFields: {},
        confidence: 0.9,
        issues: []
      }
    ],
    skippedRows: [
      {
        rowIndex: 1,
        reason: "Missing all usable identity fields."
      }
    ]
  };

  return [
    "ROLE",
    "You are GrowEasy's production CRM CSV import mapping engine.",
    "Your job is to map messy CSV rows into a clean CRM contact schema with high precision.",
    "",
    "ABSOLUTE OUTPUT RULES",
    "Return valid JSON only. No markdown, prose, comments, code fences, or trailing commas.",
    "Return exactly one top-level object with keys: rows, skippedRows.",
    "Every input rowIndex must appear exactly once, either in rows or skippedRows.",
    "Do not hallucinate. If a value is absent, ambiguous, inferred from weak evidence, or not explicitly present, use null.",
    "Never invent people, emails, phone numbers, companies, countries, statuses, addresses, websites, or notes.",
    "Do not enrich with outside knowledge. Use only the provided headers and cell values.",
    "",
    "SKIP INVALID RECORDS",
    "Skip a row by putting it in skippedRows when it has no reliable contact identity.",
    "A reliable contact identity means at least one valid email, phone, or a usable person/company name.",
    "Skip rows that are empty, test data, placeholder-only, malformed beyond repair, or contain only metadata with no contact identity.",
    "For skipped rows, return only rowIndex and a concise reason. Do not also include that row in rows.",
    "",
    "SEMANTIC HEADER DETECTION",
    "Detect meaning from headers semantically, not by exact names only.",
    "Name headers may include: name, full name, contact, contact name, first, firstname, first_name, given name, last, lastname, surname, family name.",
    "Email headers may include: email, e-mail, mail, work email, business email, contact email, primary email.",
    "Phone headers may include: phone, mobile, cellphone, cell, tel, telephone, whatsapp, contact number, work phone.",
    "Company headers may include: company, account, organization, organisation, business, employer, firm, brand, agency.",
    "Location headers may include: city, town, state, province, region, country, country code, zip, postal, postcode, address, street.",
    "Lead source headers may include: source, lead source, channel, campaign, referrer, origin, acquisition.",
    "Lead status headers may include: status, lead status, lifecycle, stage, pipeline stage, qualification, disposition.",
    "Preserve unknown but useful fields in customFields with original semantic key names and string values.",
    "",
    "EMAIL MAPPING",
    "Map only syntactically valid email addresses to mappedFields.email.",
    "If multiple emails exist, choose the most likely primary/business email and place other explicit emails in customFields.",
    "If the email is malformed or missing, set email to null and add an issue unless the row is skipped.",
    "Do not repair email domains or guess missing email parts.",
    "",
    "PHONE MAPPING",
    "Map phone/mobile/WhatsApp/contact number values to mappedFields.phone.",
    "Preserve explicit leading + country prefixes and meaningful extensions.",
    "Normalize obvious spacing, hyphens, and parentheses only when it does not change the number.",
    "Do not invent country codes. If no country code is present, keep the local phone as provided after light cleanup.",
    "If a phone value is clearly invalid, set phone to null and add an issue.",
    "",
    "COMPANY MAPPING",
    "Map company/account/organization/business/employer values to mappedFields.company.",
    "Do not use generic words like unknown, n/a, none, test, sample, or placeholder as a company.",
    "If both person and company names are present in one field, separate them only when obvious.",
    "",
    "LOCATION MAPPING",
    "Map city, state/province/region, country, postal/zip, and address fields into their matching mappedFields.",
    "Do not infer city/state/country from a phone number unless an explicit country calling code is present.",
    "Do not infer country from a city name unless the country is explicitly provided elsewhere in the row.",
    "",
    "COUNTRY CODE EXTRACTION",
    "Set mappedFields.countryCode to an ISO 3166-1 alpha-2 code only when explicitly available or safely derivable from an explicit country name/code field.",
    "Examples: United States/USA/US -> US, India/IN -> IN, United Kingdom/UK/GB -> GB.",
    "If only a phone prefix is present, countryCode may be set only when the calling code is unambiguous.",
    "If country is ambiguous or absent, countryCode must be null.",
    "",
    "LEAD STATUS MAPPING",
    "Map explicit lead status/stage values to mappedFields.leadStatus.",
    "Use concise normalized statuses when obvious: New, Open, Qualified, Unqualified, Converted, Lost, Nurture.",
    "If status is ambiguous, missing, or only implied by source/campaign, set leadStatus to null.",
    "",
    "FIELD RULES",
    "firstName and lastName must come only from explicit name data. Split full names conservatively.",
    "website must be an explicit URL/domain from the row. Do not build a website from company name.",
    "notes may contain explicit note/comment/free-text values only. Do not summarize the row into notes.",
    "confidence must be 0 to 1 and reflect mapping certainty.",
    "issues must list concrete concerns such as missing email, invalid phone, ambiguous name split, unknown status, or skipped duplicate-looking data.",
    "customFields must contain only explicit row values that do not fit the CRM schema. Values must be strings.",
    "",
    "REQUIRED JSON SHAPE",
    JSON.stringify(responseShape),
    "",
    "INPUT",
    `Batch index: ${batchIndex}`,
    `Headers: ${JSON.stringify(columns)}`,
    `Rows: ${JSON.stringify(rows)}`
  ].join("\n");
}

function parseStrictJson(text: string): GeminiBatchResponse {
  try {
    const parsed: unknown = JSON.parse(text);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "rows" in parsed &&
      "skippedRows" in parsed &&
      Array.isArray(parsed.rows) &&
      Array.isArray(parsed.skippedRows)
    ) {
      return parsed as GeminiBatchResponse;
    }
  } catch {
    throw ApiError.badRequest("Gemini returned invalid JSON.", "AI_INVALID_JSON");
  }

  throw ApiError.badRequest(
    "Gemini JSON response is missing rows or skippedRows.",
    "AI_INVALID_JSON_SHAPE"
  );
}

export async function generateCrmMappingBatch(
  request: GeminiBatchRequest
): Promise<GeminiBatchResponse> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: apiEnv.geminiModel,
    generationConfig: {
      temperature: 0,
      topP: 0.2,
      responseMimeType: "application/json"
    }
  });

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const result = await model.generateContent(buildPrompt(request));
      return parseStrictJson(result.response.text());
    } catch (error) {
      lastError = error;

      if (attempt === MAX_RETRIES || !shouldRetry(error)) {
        break;
      }

      await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
    }
  }

  if (lastError instanceof ApiError) {
    throw lastError;
  }

  throw ApiError.badRequest("Gemini CRM mapping failed after retries.", "AI_MAPPING_FAILED", {
    attempts: MAX_RETRIES
  });
}
