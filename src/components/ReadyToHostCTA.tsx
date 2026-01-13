import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const ReadyToHostCTA = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-[#2F6B4F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-white mb-4">
          {t("readyToHost")}
        </h2>
        <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          {t("shareYourHome")}
        </p>
        <Button
          onClick={() => navigate("/publish-property")}
          className="bg-white text-[#2F6B4F] hover:bg-white/90 font-semibold px-8 py-6 text-base rounded-lg"
        >
          {t("listYourPropertyBtn")}
        </Button>
      </div>
    </section>
  );
};

export default ReadyToHostCTA;
