import { Button } from "@/components/ui/button";
import { Calendar, Timer } from "lucide-react";
import Image from "next/image";

const interviews = [{
  title: 'React Interview',
  icons: '/react.svg',
  desc: 'Questions asked based on hooks, state, refs, components, HOCs, ',
  date: 'Jul 13, 2025',
  duration: '14m 32s',
  stack: ['React', 'Next.js', 'Tailwind'],

}, {
  title: 'Tailwind Interview',
  icons: '/tailwind.svg',
  desc: 'Why tailwind over bootstrap? Why classes are premade and bundle size is low...',
  date: 'Jul 14, 2025',
  duration: '6m 53s',
  stack: ['Tailwind'],
}]

export default function Home() {
  return (
    <div className="p-4 space-y-8 lg:p-16 max-w-6xl mx-auto">
      <section className="p-4 md:px-12 bg-gradient-to-r max-md:bg-gradient-to-b from-purple-900 to-black lg:my-16 flex mx-auto w-full items-center gap-8 rounded-2xl max-md:flex-col">
        <div className="space-y-2">
          <h2 className="font-bold text-3xl">Take AI-Powered Interviews to Excel</h2>
          <p className="opacity-80">Get Interviewed and Get Instant Feedback</p>
          <Button size='lg' className="bg-purple-300 mt-4 cursor-pointer hover:bg-purple-400">Start an Interview</Button>
        </div>
        <Image src='/robot.png' width={400} height={400} alt="interviews" className="max-md:hidden" />
        <Image src='/robot.png' width={250} height={250} alt="interviews" className="md:hidden" />
      </section>

      <section className="space-y-4">
        <h3 className="font-bold text-2xl">My Interviews</h3>
        {/* <p className="text-gray-500">No Interviews Yet</p> */}
        <div className="lg:grid grid-cols-3 gap-4 space-y-4">
          {interviews.map(({ title, icons, desc, date, duration, stack }) => (
            <div className="cardmakingg relative border border-purple-500 hover:shadow-lg shadow-purple-500  p-6 space-y-4 rounded-2xl h-full" key={title}>
              <p className="absolute -top-[0.5px] -right-[1px] p-2 px-6 shadow-lg shadow-purple-800 bg-purple-500 rounded-bl-2xl rounded-tr-2xl">Mixed</p>
              <Image src={icons} width={60} height={60} alt="react" />
              <h4 className="font-bold text-xl">{title}</h4>
              <p className="text-gray-300 text-sm">{desc}</p>
              {/* <div> */}
              <div className="border p-1 px-2 border-gray-600 rounded flex items-center gap-4 text-sm text-gray-100 w-fit">
                <p className="flex gap-2"><Calendar size={18} /> {date}</p>
                <p className="flex gap-2"><Timer size={18} /> {duration}</p>
              </div>
              <div className="">
                {stack.map(tech => (
                  <div className="inline-block bg-gray-700 p-1 px-3 rounded-2xl w-fit m-1 mr-2 ml-0" key={tech}>{tech}</div>
                ))}

              </div>
              <div className="flex gap-4">
                <Button className="flex-1 bg-transparent border border-white text-white">View Score</Button>
                <Button className="flex-1 bg-purple-300">ReTake Interview</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="font-bold text-2xl">All Interviews</h3>
        <p className="text-gray-500">No Interviews Yet</p>
      </section>
    </div>
  );
}
