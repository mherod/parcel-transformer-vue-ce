import less from "less";

export async function renderLess(lessContent: string, filePath: string): Promise<string> {
  const output = await less.render(lessContent, {
    filename: filePath,
    compress: true,
  });
  return output?.css ?? "";
}
