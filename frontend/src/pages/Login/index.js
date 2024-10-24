export default function Signin () {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
          <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
            <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
              <div>
                <img src={logo} className="w-48 mx-auto" alt="EduNova Logo" />
              </div>
              <div className="mt-12 flex flex-col items-center">
                <h1 className="text-2xl xl:text-3xl font-extrabold">
                  {t("signup_create")}
                </h1>
                <form onSubmit={handleSubmit} className="w-full flex-1 mt-8">
                  <div className="mx-auto max-w-xs">
                    {error && (
                      <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                      </div>
                    )}
    
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      placeholder={t("password")}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
              
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? t("signing_login") : t("sign_login")}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex-1 text-center hidden lg:flex">
              <div
                className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${signup})`,
                }}
              ></div>
            </div>
          </div>
        </div>
      );
}