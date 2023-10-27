import { useEffect, useState } from 'react'
import { FadeIn } from 'react-slide-fade-in'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBurger } from '@fortawesome/free-solid-svg-icons'
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom"
import Loading from './bundles/loading/loading'
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import firebaseConfig from './util/firebase-config'
import { GetUser } from './services/servicesApi'
import logo from './assets/logo.png'

function App() {
  initializeApp(firebaseConfig)
  const [show, setShow] = useState(false)
  const [showBurger, setShowburger] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>("")
  const [rules, setRules] = useState<any>()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isCacambas, setIsCacambas] = useState(false)
  const [isGerente, setIsGerente] = useState(false)
  const [isControlador, setIsControlador] = useState(false)
  const [isMonitor, setIsMonitor] = useState(false)
  const [isNAO, setIsNAO] = useState(false)
  const [showNao, setShowNao] = useState(false)
  const [showMonitoramento, setShowMonitoramento] = useState(false)
  const [showRelatorios, setShowRelatorios] = useState(false)
  const [showCacambas, setShowCacambas] = useState(false)
  const [showMapa, setShowMapa] = useState(false)
  const [showAcesso, setShowAcesso] = useState(false)
  const location = useLocation()
  const { pathname } = location

  const auth = getAuth()
  const navigate = useNavigate()

  const dataUser = () => {

    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {

        const uid = user.uid
        setUser(user)
        setShowburger(true)

        GetUser(user.uid)
          .then(data => {
            const objectId = Object.keys(data.data)[0]
            if (objectId) {
              const { email, rules } = data.data[objectId]
              setUser(email)

              let str = ''
              rules.forEach((x: any, a: any, b: any) => {
                if (a < b.length - 1) {
                  str += `${x},`
                } else {
                  str += x
                }
              })
              setRules(str)
              let index = rules.indexOf('admin')
              if (index !== -1) {
                setIsAdmin(true)
                localStorage.setItem('admin', "verdadeiro")
              }

              index = rules.indexOf('caçambas')

              if (index !== -1) {
                setIsCacambas(true)
              }

              index = rules.indexOf('gerente')

              if (index !== -1) {
                setIsGerente(true)
              }

              index = rules.indexOf('nao')

              if (index !== -1) {
                setIsNAO(true)
                localStorage.setItem('nao', "verdadeiro")
              }

              index = rules.indexOf('controlador')

              if (index !== -1) {
                setIsControlador(true)
              }

              index = rules.indexOf('monitor')

              if (index !== -1) {
                setIsMonitor(true)
              }
            }
          })

      } else {
        if (pathname !== '/login') {
          navigate('/unauthorized')
        }
      }
    })

  }

  const logout = () => {
    signOut(auth).then(() => {
      setShow(false)
      setShowburger(false)
      navigate('/login')
    }).catch((error) => {
    })
  }

  const hideLinks = () => {
    setShow(false)
    setShowNao(false)
    setShowMonitoramento(false)
    setShowRelatorios(false)
    setShowMapa(false)
    setShowCacambas(false)
  }

  useEffect(() => {
    dataUser()
  }, [])

  return (
    <main className='h-screen'>

      {showBurger && <div className='grid-cols-1 bg-gradient-to-r from-cyan-400 to-blue-400 h-20 border-solid flex items-center justify-center'>
        <h1 className='mx-10 text-xs lg:text-2xl md:text-xl  text-center text-cyan-50 font-bold print:hidden'>SISTEMA DE FISCALIZAÇÃO DE RESÍDUOS</h1>
      </div>}

      {showBurger && <div className='absolute top-8 left-2 z-0 print:hidden'>
        <FontAwesomeIcon icon={faBurger} size={'xl'} onClick={() => {
          navigate('/home')
          setShow(!show)
        }} />
      </div>}

      {showBurger &&
        <div className='absolute top-6 right-2 z-0 print:hidden'>
          <p className='text-blue-700 hover:text-blue-400 text-xl sm:text-2xl mr-2' onClick={logout}>sair</p>
        </div>}

      {show && <FadeIn
        from="left"
        positionOffset={800}
        triggerOffset={100}
        delayInMilliseconds={100}
        durationInMilliseconds={800}
      >

        <div className='w-full absolute top-0'>
          <div className='grid-cols-3 h-screen bg-gray-400 z-10 flex'>
            <div className='bg-white w-4/5 md:w-1/3 flex'>
              <div >
                <div className="flex flex-col gap-2 w-full text-center p-2">
                  <div className="flex flex-col items-center justify-center">
                    <img src={logo} className='w-1/3 mt-6 mb-2'></img>
                    <h1 className="text-xs sm:text-xl ml-2">{user}</h1>
                    <h1 className="text-xs sm:text-xl ml-2">{rules}</h1>
                  </div>
                </div>

                {(isAdmin) && <div className="flex flex-col mt-6 ml-4">
                  <button
                    className="w-2/3 h-9 bg-sky-900  hover:bg-sky-700 text-white text-left pl-1 rounded-md"
                    onClick={() => {
                      setShowAcesso(pre => !pre)
                      setShowNao(false)
                      setShowMonitoramento(false)
                      setShowRelatorios(false)
                      setShowMapa(false)
                      setShowCacambas(false)
                    }}
                  >Administrador &darr;</button>

                  {showAcesso &&

                    <FadeIn
                      from="top"
                      positionOffset={0}
                      triggerOffset={0}
                      delayInMilliseconds={100}
                      durationInMilliseconds={1000}
                    >
                      <ul className="mt-2 ml-1">
                        <li className="text-left flex-none">
                          <Link to='/registro' onClick={hideLinks}>Registrar acesso</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='/empregados' onClick={hideLinks}>Listar funcionários</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='/empregados/cadastro' onClick={hideLinks}>Cadastrar funcionário</Link>
                        </li>
                      </ul>
                    </FadeIn>}

                </div>}

                {(isNAO || isAdmin) && <div className="flex flex-col mt-2 ml-4">
                  <button
                    className="w-2/3 h-9 bg-sky-900  hover:bg-sky-700 text-white text-left pl-1 rounded-md"
                    onClick={() => {
                      setShowNao((showMapa) => !showMapa)
                      setShowMonitoramento(false)
                      setShowRelatorios(false)
                      setShowMapa(false)
                      setShowCacambas(false)
                      setShowAcesso(false)
                    }}
                  >NAO &darr;</button>

                  {showNao &&

                    <FadeIn
                      from="top"
                      positionOffset={0}
                      triggerOffset={0}
                      delayInMilliseconds={100}
                      durationInMilliseconds={1000}
                    >
                      <ul className="mt-2 ml-1">
                        <li className="text-left flex-none">
                          <Link to='ordem/criar' onClick={hideLinks}>Gerar OS</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='ordem/gerenciar' onClick={hideLinks}>Gerenciar OS</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='ordem/remover' onClick={hideLinks}>Remover Itens</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='email/gerenciar' onClick={hideLinks}>Gerenciar E-mails</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='relatorio/checar' onClick={hideLinks}>Checar Relatórios</Link>
                        </li>
                      </ul>
                    </FadeIn>}

                </div>}

                {isAdmin && <div className="flex flex-col mt-2 ml-4">
                  <button
                    className="border-none w-2/3 h-9 bg-sky-900  hover:bg-sky-700 text-white text-left pl-1 rounded-md"
                    onClick={() => {
                      setShowMonitoramento(false)
                      setShowNao(false)
                      setShowRelatorios(false)
                      setShowMapa((showMapa) => !showMapa)
                      setShowCacambas(false)
                      setShowAcesso(false)
                    }}
                  >Mapas &darr;</button>

                  {showMapa &&

                    <FadeIn
                      from="top"
                      positionOffset={0}
                      triggerOffset={0}
                      delayInMilliseconds={100}
                      durationInMilliseconds={1000}
                    >
                      <ul className="mt-2 ml-1">
                        <li className="text-left flex-none">
                          <Link to='mapas/criar' onClick={hideLinks}>Gerar mapas</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='mapas/visualizar' onClick={hideLinks}>Painel Shapes</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='mapas/ordens' onClick={hideLinks}>Painel Ordens</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='mapas/cacambas' onClick={hideLinks}>Painel Caçambas</Link>
                        </li>
                      </ul>
                    </FadeIn>}
                </div>}

                {(isAdmin || isControlador) && <div className="flex flex-col mt-2 ml-4">
                  <button
                    className="w-2/3 h-9 bg-sky-900  hover:bg-sky-700 text-white text-left pl-1 rounded-md"
                    onClick={() => {
                      setShowNao(false)
                      setShowMonitoramento(false)
                      setShowRelatorios((showRelatorios) => !showRelatorios)
                      setShowMapa(false)
                      setShowCacambas(false)
                      setShowAcesso(false)
                    }}
                  >Relatórios &darr;</button>

                  {showRelatorios &&

                    <FadeIn
                      from="top"
                      positionOffset={0}
                      triggerOffset={0}
                      delayInMilliseconds={100}
                      durationInMilliseconds={1000}
                    >
                      <ul className="mt-2 ml-1">
                        <li className="text-left flex-none">
                          <Link to='relatorio/enviar' onClick={hideLinks}>Enviar relatório</Link>
                        </li>
                      </ul>
                    </FadeIn>}

                </div>}

                {isMonitor && <div className="flex flex-col mt-2 ml-4">
                  <button
                    className="border-none w-2/3 h-9 bg-sky-900  hover:bg-sky-700 text-white text-left pl-1 rounded-md"
                    onClick={() => {
                      setShowMonitoramento((showMonitoramento) => !showMonitoramento)
                      setShowNao(false)
                      setShowRelatorios(false)
                      setShowMapa(false)
                      setShowCacambas(false)
                      setShowAcesso(false)
                    }}
                  >Monitoramento &darr;</button>

                  {showMonitoramento &&

                    <FadeIn
                      from="top"
                      positionOffset={0}
                      triggerOffset={0}
                      delayInMilliseconds={100}
                      durationInMilliseconds={1000}
                    >
                      <ul className="mt-2 ml-1 gap-y-2">
                        <li className="text-left flex-none">
                          <Link to='monitoramento/criar' onClick={hideLinks}>Salvar empresa</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='monitoramento/acessos/criar' onClick={hideLinks}>Salvar acesso</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='monitoramento/listar' onClick={hideLinks}>Listar</Link>
                        </li>
                      </ul>
                    </FadeIn>}
                </div>}


                {(isAdmin || isCacambas) && <div className="flex flex-col mt-2 ml-4">
                  <button
                    className="border-none w-2/3 h-9 bg-sky-900  hover:bg-sky-700 text-white text-left pl-1 rounded-md"
                    onClick={() => {
                      setShowMonitoramento(false)
                      setShowNao(false)
                      setShowRelatorios(false)
                      setShowMapa(false)
                      setShowCacambas(pre => !pre)
                      setShowAcesso(false)
                    }}
                  >Caçambas &darr;</button>

                  {showCacambas &&

                    <FadeIn
                      from="top"
                      positionOffset={0}
                      triggerOffset={0}
                      delayInMilliseconds={100}
                      durationInMilliseconds={1000}
                    >
                      <ul className="mt-2 ml-1">
                        <li className="text-left flex-none">
                          <Link to='/cacambas/' onClick={hideLinks}>Gerir caçambas</Link>
                        </li>
                        <li className="text-left flex-none">
                          <Link to='/cacambas/modulo/manejar' onClick={hideLinks}>Manejar caçambas</Link>
                        </li>
                      </ul>
                    </FadeIn>}
                </div>}

              </div>
            </div>
          </div>
        </div>

      </FadeIn>}

      <Outlet />

      {isLoading && <div className='flex items-center justify-center'>
        <Loading />
      </div>}
    </main>
  )
}

export default App
