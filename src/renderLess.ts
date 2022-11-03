import less from "less";

export async function renderLess(lessContent: string, filePath: string): Promise<string> {
  const output = await less.render(lessContent, {
    filename: filePath,
  });
  return output?.css ?? "";
}
