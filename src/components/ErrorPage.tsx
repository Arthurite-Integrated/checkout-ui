export default function ErrorPage({msg="Error"}:{msg: string}) {
  return(
    <div className="flex bg-black h-screen w-screen justify-center items-center flex-col text-center">
      <h1 className="sm:text-md md:text-3xl text-white">{msg}</h1>
      <p className="text-sm text-[10px] text-white/50">Please confirm you got to this page the right way.</p>
    </div>
  )
}