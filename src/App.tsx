import { useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/NewNoteCard";
import { NoteCard } from "./components/NoteCard";

export function App() {
    const [notes, setNotes] = useState([
        {
            id: 1,
            date: new Date(),
            content: "Hello World",
        },
        {
            id: 2,
            date: new Date(),
            content: "Terminar trilha de React e começar a de Node",
        },
    ]);

    function onNoteCreated(content: string) {

        const newNote = {
            id: Math.random(),
            date: new Date(),
            content,
        };

        setNotes([newNote, ...notes]);
    }

    return (
        <div className="mx-auto max-w-6xl my-12 space-y-6">
            <img src={logo} alt="NLW Expert" />

            <form className="w-full">
                <input
                    type="text"
                    placeholder="Busque em suas notas..."
                    className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-state-500"
                />
            </form>

            <div className="h-px bg-slate-700" />

            <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
                <NewNoteCard onNoteCreated={onNoteCreated}/>
                {notes.map((item) => (
                    <NoteCard key={item.id} note={item} />
                ))}
            </div>
        </div>
    );
}
