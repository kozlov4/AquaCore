import Image from "next/image";
import { Gooogle } from "../layouts/icons/google";

export function Authorization({type}) {
const isLogin = type === "login"

  return (
    <header className="w-screen h-full flex">
      <div className="w-1/2 h-[90%]">
        <div id="logo" className="w-full h-[10%] mt-3 pl-3">
          <Image
            src="/images/Logo.svg"
            alt="fish"
            width={0}
            height={0}
            className="w-20 h-auto"
          />

        </div>
        <div className="w-full h-[90%] px-[20%] py-[10%]">
            <h1 className="text-black font-medium text-3xl">{isLogin? "З поверненням!" : "Почніть зараз"}</h1>
            <h3 className={`text-black font-inter text-base font-normal leading-normal ${isLogin? "visible" : "hidden"}`}>Введіть свої облікові дані, щоб увійти</h3>
            <form action="" className={`w-full h-full ${isLogin? "pt-[10%]" : "pt-[15%]"} `}>
                <div className={`${isLogin? "hidden" : "visible"}`}>
                <label htmlFor="" className="name text-black font-medium text-lg">Ім'я</label>
                <input type="text" name="name" placeholder="Введіть своє ім'я" className="w-full h-[10%] mb-[5%] flex pt-2.5 pr-0 pb-2.5 pl-2.5 items-start  shrink-0 rounded-[10px] border border-[#D9D9D9]" />
                </div>
                 <div>
                <label htmlFor="" className="text-black font-medium text-lg">Адреса електронної пошти</label>
                <input type="text" name="email" placeholder="Введіть свою електронну адресу" className="w-full h-[10%] mb-[5%] flex pt-2.5 pr-0 pb-2.5 pl-2.5 items-start  shrink-0 rounded-[10px] border border-[#D9D9D9]" />
                </div>
                 <div>
                <div className="w-full flex justify-between items-baseline">
                <label htmlFor="" className="text-black font-medium text-lg">Пароль</label>
                <a href="" className={`text-(--action-sec,#0C2A92) font-inter text-xs font-medium leading-normal ${isLogin? "visible" : "hidden"}`}>Забули пароль</a>
                </div>
                <input type="text" name="password" placeholder="Введіть свій пароль" className="w-full h-[10%] mb-[5%] flex pt-2.5 pr-0 pb-2.5 pl-2.5 items-start  shrink-0 rounded-[10px] border border-[#D9D9D9]" />
                </div>
                <div className="w-full h-auto flex gap-[3%] items-center">
                    <input type="checkbox" name="checker" className="w-6 h-6 rounded-lg border-2 border-gray-400 appearance-none "/>
                    <span className="text-black text-xs font-medium underline">{isLogin? "Запам'ятайте на 30 днів" : "Я погоджуюся з умовами & використання"}</span>
                </div>
                <button id="authorization" className="w-full h-auto mt-[5%] flex justify-center py-2.5 pl-2.5 items-center gap-2.5 rounded-[10px] border border-[#D688B7] bg-[#D688B7] text-white text-center text-lg font-bold">{isLogin?"Увійти" : "Реєстрація"}</button>
                <div className="w-full h-auto flex justify-center items-center mt-[10%] mb-[10%]">
                    <div className="w-[40%] h-1 bg-[#F5F5F5]"></div>
                    <span className="text-black text-xs font-medium">Або</span>
                    <div className="w-[40%] h-1 bg-[#F5F5F5]"></div>
                </div>
                <div className="w-full flex justify-center">
                <button id="google-register" className="w-[45%] h-auto inline-flex items-start gap-2.5 px-5 py-1 rounded-[10px] border border-[#D9D9D9] text-black text-sm font-medium leading-normal justify-center">
                    <Gooogle/>
                    Увійти через гугл
                </button>
                </div>
                <div className="w-full h-auto flex justify-center mt-[5%]">
                    <p className="text-black font-poppins text-sm font-medium leading-normal">{isLogin?"Ще не маєте облікового запису?" : "У вас є обліковий запис?"} <a href="" id="signIn-link" className="text-[#0F3DDE]">{isLogin? "Зареєструватися" : "Увійти"}</a></p>
                </div>
            </form>
        </div>
      </div>

      <div
        className="w-1/2 h-screen
        bg-[url('/images/fish.png')] 
        bg-size-[100%_100%]
        bg-center 
        bg-no-repeat"
      ></div>
    </header>
  );
}
