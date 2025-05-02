import { redirect } from 'next/navigation';

export default function Home() {

  redirect('/login');

  // return (
  //   <div className="w-full h-screen flex items-center justify-center">
  //     <span className="text-5xl font-bold">Hello, I am a simple component</span>
  //   </div>
  // );
}
