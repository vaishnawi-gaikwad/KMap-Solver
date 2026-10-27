
import React from 'react';

import {
  ArrowLeft,
  BookOpen,
  Clock,
  Lightbulb,
  History,
  GitBranch,
  Cpu,
  Grid2X2,
  Zap,
  Binary,
  Sparkles,
  Shuffle
} from 'lucide-react';


export default function LearnFromRoots({ onBack }) {
    
  const facts = [
    {
      icon: History,
      title: 'Named After Its Creator',
      text: 'Maurice Karnaugh published his map-based Boolean simplification method in 1953.',
      color: 'text-[#4FC3B8]',
    },
    {
      icon: Shuffle,
      title: 'The Edges Connect!',
      text: 'The left and right edges are adjacent, as are the top and bottom edges.',
      color: 'text-purple-400',
    },
    {
      icon: Cpu,
      title: 'Simpler Digital Circuits',
      text: 'Simplifying Boolean expressions can reduce the logic gates needed in a circuit.',
      color: 'text-blue-400',
    },
    {
      icon: Binary,
      title: 'Gray Code Is the Secret',
      text: 'Adjacent K-Map cells differ in only one variable, making simplification possible.',
      color: 'text-yellow-400',
    },
    {
      icon: Grid2X2,
      title: 'Groups Follow a Pattern',
      text: 'Valid rectangular groups contain 1, 2, 4, 8, or 16 cells, when available.',
      color: 'text-pink-400',
    },
    {
      icon: Zap,
      title: 'More Than an Exam Topic',
      text: 'K-Maps help simplify combinational logic in digital electronics and control circuits.',
      color: 'text-orange-400',
    },
  ];

  const [dailyFact] = React.useState(
    () => Math.floor(Math.random() * facts.length)
  );

  return (
    <div className="min-h-screen bg-[#07110F] text-slate-100 px-4 py-6 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

    
{/* Did You Know? */}
<div className="relative overflow-hidden rounded-3xl border border-[#4FC3B8]/40 bg-gradient-to-br from-[#17332F] to-[#0F2622] p-6 sm:p-8">
  <div className="flex items-center gap-3 mb-4">
    <Sparkles className="w-6 h-6 text-[#4FC3B8]" />
    <h2 className="text-lg sm:text-xl font-extrabold">
      Did You Know?
    </h2>
  </div>

  {(() => {
    const fact = facts[dailyFact];
    const Icon = fact.icon;

    return (
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-[#4FC3B8]/10 p-3">
          <Icon className={`w-7 h-7 ${fact.color}`} />
        </div>

        <div>
          <h3 className="font-bold text-[#4FC3B8] mb-2">
            {fact.title}
          </h3>
          <p className="text-sm text-slate-300 leading-7">
            {fact.text}
          </p>
        </div>
      </div>
    );
  })()}
</div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#4FC3B8] hover:text-[#69E3D8] font-bold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to K-Map Solver
        </button>

        {/* Page Heading */}
        <div className="bg-[#172A27] border border-[#22423D] rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8 text-[#4FC3B8]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Learn from Roots
            </h1>
          </div>

          <p className="text-[#8BA8A3] text-sm sm:text-base leading-7">
            Discover the history behind Karnaugh Maps, understand the
            concepts step by step, and explore how Boolean logic helps
            power the digital world around us.
          </p>
        </div>

        {/* History Section */}
        <section className="bg-[#0F2622] border border-[#22423D] rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#4FC3B8]" />
            <div>
              <h2 className="text-xl font-extrabold">
                01. History of K-Maps
              </h2>
              <p className="text-sm text-[#8BA8A3] mt-1">
                Discover the origins and evolution of Karnaugh Maps.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#07110F] border border-[#22423D] p-5 space-y-3">
            <h3 className="font-bold text-[#4FC3B8]">
              Where did K-Maps begin?
            </h3>
            <p className="text-sm text-slate-300 leading-7">
              Karnaugh Maps are named after Maurice Karnaugh, who
              introduced this visual method for simplifying Boolean
              expressions in 1953. The technique builds on earlier
              work in Boolean algebra and logic simplification.
            </p>
            <p className="text-sm text-slate-300 leading-7">
              K-Maps made it easier to identify patterns in truth
              values and reduce logical expressions, helping engineers
              design simpler digital circuits.
            </p>
          </div>

          <div className="rounded-2xl bg-[#07110F] border border-[#22423D] p-5 space-y-3">
            <h3 className="font-bold text-[#4FC3B8]">
              Watch and Explore
            </h3>
            <p className="text-sm text-slate-300 leading-6">
              Watch educational videos about Maurice Karnaugh,
              the development of Boolean algebra, and the evolution
              of digital logic design.
            </p>

            
<div className="w-full overflow-hidden rounded-2xl border border-[#4FC3B8]/30 bg-black">
  <iframe
    className="w-full aspect-video"
    src="https://www.youtube.com/embed/-puKBVdmbm8"
    title="Introduction to Karnaugh Maps"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  />
</div>

<p className="text-xs text-[#8BA8A3]">
  Video lesson: Introduction to Karnaugh Maps. This lesson covers
  the K-Map concept; it is not specifically a history documentary.
</p>

<a
  href="https://www.youtube.com/results?search_query=Maurice+Karnaugh+history+1953"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#172A27] hover:bg-[#22423D] border border-[#4FC3B8]/40 text-[#4FC3B8] font-bold text-sm transition-colors"
>
  Find History Documentaries ↗
</a>

          </div>
        </section>

        {/* Future Learning Sections */}
        <section className="bg-[#0F2622] border border-[#22423D] rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-[#4FC3B8]" />
            <h2 className="text-xl font-extrabold">
              Coming Up Next
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-[#172A27] border border-[#22423D] rounded-2xl p-5 sm:p-6">
              <h3 className="font-bold text-[#4FC3B8] mb-3">
                02. Concepts of K-Maps
              </h3>

              <p className="text-sm text-[#8BA8A3] leading-6 mb-5">
                Learn K-Map concepts and Boolean expression simplification
                through these three video lessons.
              </p>

              <div className="space-y-5">
                <div className="rounded-xl overflow-hidden border border-[#22423D]">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/RO5alU6PpSU"
                      title="K-Map Concepts - Lesson 1"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#22423D]">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/i5QjUVgY-XU"
                      title="K-Map Concepts - Lesson 2"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#22423D]">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/wduY7oZnF-g"
                      title="K-Map Concepts - Lesson 3"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>


            
            <div className="bg-[#172A27] border border-[#22423D] rounded-2xl p-5 sm:p-6">
              <h3 className="font-bold text-[#4FC3B8] mb-3">
                03. K-Maps in Everyday Life
              </h3>

              <p className="text-sm text-[#8BA8A3] leading-6 mb-5">
                Discover how digital logic powers everyday systems,
                from traffic signals to elevators and washing machines.
              </p>

              <div className="space-y-5">
                <div className="rounded-xl overflow-hidden border border-[#22423D]">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/O7yoa-hwnkI"                      title="Traffic Light Control System"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-slate-100">
                      1. Smart Traffic Lights
                    </h4>
                    <p className="text-sm text-[#8BA8A3] mt-1">
                      Understand how controllers coordinate traffic signals.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#22423D]">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                     src="https://www.youtube.com/embed/rKp4pe92ljg"
                      title="Elevator Control System"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-slate-100">
                      2. Elevator Control Systems
                    </h4>
                    <p className="text-sm text-[#8BA8A3] mt-1">
                      Explore the sensors and control logic behind elevators.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#22423D]">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                     src="https://www.youtube.com/embed/Qwow5AS29W8"
                      title="Washing Machine Control System"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-slate-100">
                      3. Automatic Washing Machines
                    </h4>
                    <p className="text-sm text-[#8BA8A3] mt-1">
                      See how sensors and electronic controls coordinate washing cycles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

{/* Amazing K-Map Facts */}
<section className="space-y-5">
  <div className="text-center sm:text-left">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4FC3B8] mb-2">
      Little things worth knowing
    </p>
    <h2 className="text-2xl sm:text-3xl font-extrabold">
      Amazing K-Map Facts
    </h2>
    <p className="text-sm text-[#8BA8A3] mt-2">
      Six fascinating facts behind the logic.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {facts.map((fact, index) => {
      const Icon = fact.icon;

      return (
        <article
          key={fact.title}
          className="group rounded-2xl border border-[#22423D] bg-[#0F2622] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#4FC3B8]/60 hover:bg-[#172A27] hover:shadow-xl hover:shadow-[#4FC3B8]/5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-[#4FC3B8]/10 p-3 transition-transform duration-300 group-hover:scale-110">
              <Icon className={`w-6 h-6 ${fact.color}`} />
            </div>

            <span className="text-xs font-extrabold text-[#4FC3B8]/60">
              FACT {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <h3 className="font-extrabold text-slate-100 mb-2">
            {fact.title}
          </h3>

          <p className="text-sm text-[#8BA8A3] leading-6">
            {fact.text}
          </p>
        </article>
      );
    })}
  </div>
</section>

      </div>
    </div>
  );
}
