import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/NewNoteCard";
import { NoteCard } from "./components/NoteCard";

export function App() {

    interface Note {
        id: string
        date: Date
        content: string
    }

    const [notes, setNotes] = useState<Note[]>(() => {
        const notesOnStorage = localStorage.getItem("notes");

        if (notesOnStorage) return JSON.parse(notesOnStorage);

        return [];
    });

    const [search, setSearch] = useState("");

    function onNoteCreated(content: string) {
        const newNote = {
            id: crypto.randomUUID(),
            date: new Date(),
            content,
        };
        const notesArray = [newNote, ...notes];
        setNotes(notesArray);
        localStorage.setItem("notes", JSON.stringify(notesArray));
    }

    function onNoteDeleted(id: string) {
        const notesArray = notes.filter((item) => item.id !== id);
        setNotes(notesArray);
        localStorage.setItem("notes", JSON.stringify(notesArray));
    }

    function handleSearchNote(e: ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        setSearch(query);
    }

    const filteredNotes =
        search !== ""
            ? notes.filter((item) =>
                  item.content
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
              )
            : notes;

    return (
        <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
            <img src={logo} alt="NLW Expert" />

            <form className="w-full">
                <input
                    type="text"
                    placeholder="Busque em suas notas..."
                    className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-state-500"
                    onChange={handleSearchNote}
                />
            </form>

            <div className="h-px bg-slate-700" />

            <div className="grid grid-cols1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
                <NewNoteCard onNoteCreated={onNoteCreated} />
                {filteredNotes.map((item) => (
                    <NoteCard key={item.id} note={item} onNoteDeleted={onNoteDeleted}/>
                ))}
            </div>
        </div>
    );
}
