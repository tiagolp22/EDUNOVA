import time from "assets/imgs/time.png";
import price from "assets/imgs/price.png";
import friendly from "assets/imgs/friendly.png";
import expertise from "assets/imgs/expertise.png";

export default function IconHome({ t }) {
  return (
    <section className="text-gray-700 body-font mt-10">
      <div className="flex justify-center text-3xl font-bold text-[--azul-medio] text-center">
        {t("iconsSection_why")}
      </div>
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap text-center justify-center">
          <div className="p-4 md:w-1/4 sm:w-1/2">
            <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
              <div className="flex justify-center">
                <img src={time} className="w-32 mb-3" alt="Icon time" />
              </div>
              <h2 className="title-font font-regular text-2xl text-[--azul-medio]">
                {t("iconsSection_time")}
              </h2>
            </div>
          </div>

          <div className="p-4 md:w-1/4 sm:w-1/2">
            <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
              <div className="flex justify-center">
                <img src={price} className="w-32 mb-3" alt="icon price" />
              </div>
              <h2 className="title-font font-regular text-2xl text-[--azul-medio]">
                {t("iconsSection_value")}
              </h2>
            </div>
          </div>

          <div className="p-4 md:w-1/4 sm:w-1/2">
            <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
              <div className="flex justify-center">
                <img
                  src={expertise}
                  className="w-32 mb-3"
                  alt="Icon expertise"
                />
              </div>
              <h2 className="title-font font-regular text-2xl text-[--azul-medio]">
                {t("iconsSection_expertise")}
              </h2>
            </div>
          </div>

          <div className="p-4 md:w-1/4 sm:w-1/2">
            <div className="px-4 py-6 transform transition duration-500 hover:scale-110">
              <div className="flex justify-center">
                <img src={friendly} className="w-32 mb-3" alt="Icon friendly" />
              </div>
              <h2 className="title-font font-regular text-2xl text-[--azul-medio]">
                {t("iconsSection_friendly")}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
