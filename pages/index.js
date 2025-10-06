import { useTranslation } from "next-i18next";
export default function Home() {
  const { t } = useTranslation();
  return (
    <main>
      <h1>{t("Access For Justice")}</h1>
      <p>{t("Ontario-first MVP — deployed on Cloud Run")}</p>
      <a href="/api/health" target="_blank">API Health</a>
    </main>
  );
}