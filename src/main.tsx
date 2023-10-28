import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './main.css'
import App from './App'
import Login from './pages/login/login'
import Unauthorized from './bundles/errors/unauthorized'
import ErrorPage from './bundles/errors/error-page'
import Noverified from './bundles/errors/noverified'
import { QueryClient, QueryClientProvider } from "react-query";
import ManageOrdem from './pages/ordem/manage/manage'
import EditOrdem from './pages/ordem/edit/edit'
import ManagerEmail from './pages/ordem/emails/emails'
import AcessCreate from './pages/monitor/access/create/createacess'
import MonitorCreate from './pages/monitor/enterprise/create/criarempresa'
import ListEnterprises from './pages/monitor/enterprise/release/listarempresa'
import ForgotPassword from './bundles/errors/forgot-password'
import Send from './bundles/success/emailenviado'
import ReportSend from './pages/ordem/reports/enviarrelatorio'
import CheckReporter from './pages/ordem/checkreporter/checkreporter'
import CriarMapa from './pages/maps/criarmapa'
import Cluster from './pages/maps/components/clusters/cliusterShapes'
import ClusterOrdens from './pages/maps/components/clusters/cliusterOrdens'
import MainCacambas from './pages/cacambas/main-cac'
import Cacambas from './pages/cacambas/components/subpages/cacambas/apply'
import ClientsAtualizar from './pages/cacambas/components/subpages/clientes/update'
import Clients from './pages/cacambas/components/subpages/clientes/create'
import ClientsRemover from './pages/cacambas/components/subpages/clientes/inative'
import CacambasRelease from './pages/cacambas/components/subpages/cacambas/release'
import ClusterCacambas from './pages/maps/components/clusters/cliusterCacambas'
import RegisterDumpster from './pages/cacambas/components/subpages/dumpster/register'
import DumpsterRemove from './pages/cacambas/components/subpages/dumpster/inative'
import Register from './pages/admin/register'
import ControlDumpster from './pages/cacambas/components/subpages/manejo/control'
import DumpsterReative from './pages/cacambas/components/subpages/dumpster/reative'
import Employees from './pages/admin/release-employees'
import Home from './pages/home/home'
import CreateEmployee from './pages/admin/create-employees'
import ClienteReative from './pages/cacambas/components/subpages/clientes/reative'
import NewOrderPage from './pages/novaordem/neworder'
import { SisfirProvider } from './context/sisfircontext'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [


      {
        path: "Home",
        element:
          <div className='flex items-center justify-center p-3 border '>
            <Home />
          </div>,
      },

      {
        path: "registro",
        element: <Register />,
      },

      {
        path: "empregados",
        element: <Employees />,
      },


      {
        path: "empregados/cadastro",
        element: <CreateEmployee />,
      },

      {
        path: "login",
        element: <Login />,
      },

      {
        path: "unauthorized",
        element: <Unauthorized />,
      },

      {
        path: "noverified",
        element: <Noverified />,
      },

      {
        path: "ordem/criar",
        element: <SisfirProvider><NewOrderPage /></SisfirProvider>
      },

      {
        path: "ordem/gerenciar",
        element: <ManageOrdem />,
      },

      {
        path: "ordem/remover",
        element: <EditOrdem />,
      },

      {
        path: "email/gerenciar",
        element: <ManagerEmail />,
      },

      {
        path: "monitoramento/criar",
        element: <MonitorCreate />,
      },

      {
        path: "monitoramento/acessos/criar",
        element: <AcessCreate />,
      },

      {
        path: "monitoramento/listar",
        element: <ListEnterprises />,
      },

      {
        path: "senha/recuperar",
        element: <ForgotPassword />,
      },

      {
        path: "senha/enviada",
        element: <Send />,
      },

      {
        path: "relatorio/enviar",
        element: <ReportSend />,
      },

      {
        path: "relatorio/checar",
        element: <CheckReporter />,
      },

      {
        path: "mapas/criar",
        element: <CriarMapa />,
      },

      {
        path: "mapas/visualizar",
        element: <Cluster />,
      },

      {
        path: "mapas/cacambas",
        element: <ClusterCacambas />,
      },

      {
        path: "mapas/ordens",
        element: <ClusterOrdens />,
      },

      {
        path: "/cacambas",
        element: <MainCacambas />,
        children: [
          {
            path: "/cacambas/clientes",
            element: <Clients />
          },

          {
            path: "/cacambas/clientes/atualizar",
            element: <ClientsAtualizar />
          },

          {
            path: "/cacambas/clientes/remover",
            element: <ClientsRemover />
          },

          {
            path: "/cacambas/clientes/reativar",
            element: <ClienteReative />
          },


          {
            path: "/cacambas/cadastro",
            element: <Cacambas />
          },

          {
            path: "/cacambas/listar",
            element: <CacambasRelease />
          },

          {
            path: "/cacambas/modulo/registrar",
            element: <RegisterDumpster />
          },

          {
            path: "/cacambas/modulo/remover",
            element: <DumpsterRemove />
          },

          {
            path: "/cacambas/modulo/reativar",
            element: <DumpsterReative />
          },

          {
            path: "/cacambas/modulo/manejar",
            element: <ControlDumpster />
          },
        ]
      }

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
