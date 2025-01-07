import {
  Challenge,
  ChallengeTestCase,
  ChallengeTestCaseInput,
} from "@/lib/utils";
import axios from "axios";

const { RAPIDAPI_API_KEY } = process.env;

export async function runCode(code: string, args: any[]) {
  const res = await axios.post(
    "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
    {
      language: "python",
      stdin: args.join(" "),
      files: [
        {
          name: "index.py",
          content: code,
        },
      ],
    },
    {
      headers: {
        "x-rapidapi-key": RAPIDAPI_API_KEY,
        "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}
