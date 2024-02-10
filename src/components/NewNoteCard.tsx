import * as Dialog from "@radix-ui/react-dialog";
import { TrendingUpIcon, X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [content, setContent] = useState("");

    function handleStartEditor() {
        setShouldShowOnboarding(false);
    }

    function handleContentChanged(e: ChangeEvent<HTMLTextAreaElement>) {
        setContent(e.target.value);

        if (e.target.value === "") {
            setShouldShowOnboarding(true);
        }
    }

    function handleSaveNote(e: FormEvent) {
        e.preventDefault();
        if (content === "") return;
        onNoteCreated(content);
        setContent("");
        toast.success("Nota salva com sucesso!");
        setShouldShowOnboarding(true);
    }

    function handleStartRecording() {
        const isSpeechRecognitionAPIAvailable =
            "SpeechRecognition" in window ||
            "webkitSpeechRecognition" in window;
        if (!isSpeechRecognitionAPIAvailable) {
            alert(
                "Infelizmente o seu browser não aceita a API de gravação :( "
            );
            return;
        }

        setIsRecording(true);
        setShouldShowOnboarding(false);

        const SpeechRecognitionAPI =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        speechRecognition = new SpeechRecognitionAPI();
        speechRecognition.lang = "pt-BR";
        speechRecognition.continuous = true;
        speechRecognition.interimResults = true;
        speechRecognition.maxAlternatives = 1;
        speechRecognition.onresult = (e) => {
            const transcription = Array.from(e.results).reduce((acc, cur) => {
                return acc.concat(cur[0].transcript);
            }, "");
            setContent(transcription);
        };

        speechRecognition.start();
    }

    function handleStopRecording() {
        setIsRecording(false);
        if (speechRecognition !== null)
            speechRecognition.stop();
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-lg bg-slate-700 gap-3 p-5 overflow-hidden relative text-left flex flex-col hover:ring-2 hover:ring-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
                <span className="text-sm font-medium text-slate-200">
                    Adicionar nota
                </span>
                <p className="text-sm leading-6 text-slate-400">
                    Grave uma nota em áudio que será convertida para texto
                    automaticamente.
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t pointer-events-none from-black/40 to-black/0" />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50" />
                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-lg flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                        <X className="size-5" />
                    </Dialog.Close>
                    <form className="flex flex-col flex-1">
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className="text-sm font-medium text-slate-200">
                                Adicionar nota
                            </span>
                            {shouldShowOnboarding ? (
                                <p className="text-sm leading-6 text-slate-400 font-medium">
                                    Comece{" "}
                                    <button
                                        type="button"
                                        onClick={handleStartRecording}
                                        className="text-lime-400 font-bold hover:underline"
                                    >
                                        gravando uma nota
                                    </button>{" "}
                                    em áudio ou se preferir{" "}
                                    <button
                                        type="button"
                                        className="text-lime-400 font-bold hover:underline"
                                        onClick={handleStartEditor}
                                    >
                                        utilize apenas texto
                                    </button>
                                    .
                                </p>
                            ) : (
                                <textarea
                                    autoFocus
                                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                                    onChange={handleContentChanged}
                                    value={content}
                                />
                            )}
                        </div>

                        {isRecording ? (
                            <button
                                type="button"
                                onClick={handleStopRecording}
                                className="w-full flex itens-center justify-center gap-2  bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-bold hover:text-slate-100"
                            >
                                <div className=" mt-1 size-3 rounded-full bg-red-500 animate-pulse" />
                                Gravando! (clique para interromper)
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSaveNote}
                                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-bold hover:bg-lime-500"
                            >
                                Salvar nota
                            </button>
                        )}
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
