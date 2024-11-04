import Box1 from "components/dash_admin/Box1";
import Box2 from "components/dash_admin/Box2";
import MenuAdmin from "components/dash_admin/MenuAdmin";
import Box3 from "components/dash_admin/Box3";
import { Outlet } from "react-router-dom";
import UserIndex from "users/UserIndex";

export default function Admin({ t, language }) {
  return (
    <div>
      <div className="flex h-screen bg-gray-200">
        <MenuAdmin t={t} />

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
            <div className="flex items-center">
              <div className="relative mx-4 lg:mx-0">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>

                <input
                  className="w-32 pl-10 pr-4 rounded-md form-input sm:w-64 focus:border-indigo-600"
                  type="text"
                  placeholder="Search"
                />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <div className="container px-6 py-8 mx-auto">
              <h3 className="text-3xl font-medium text-gray-700">Dashboard</h3>

              <div className="mt-4">
                <div className="flex flex-wrap -mx-6">
                  <Box1 t={t} language={language} />

                  <Box2 t={t} language={language} />

                  <Box3 t={t} language={language} />
                </div>
              </div>

              <div className="mt-8"></div>

              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
