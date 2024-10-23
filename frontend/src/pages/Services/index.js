
export default function Services({ t }) {
  const services = t('services.items', { returnObjects: true });
  const additionalInfo = t('services.additionalInfo', { returnObjects: true });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {t('services.title')}
          </h2>
          <p className="text-xl">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Serviços Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Informações Adicionais */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold mb-4">Informações Importantes:</h4>
          <ul className="list-disc pl-5 space-y-2">
            {additionalInfo.map((info, index) => (
              <li key={index} className="text-gray-600">
                {info}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}