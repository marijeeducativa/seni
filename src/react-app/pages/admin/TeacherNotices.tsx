import AdminLayout from "@/react-app/components/AdminLayout";
import { useEffect, useState } from "react";
import { Send, Trash2, Check, ExternalLink } from "lucide-react";
import { getAvisos, createAviso } from "@/react-app/lib/supabase-helpers";

interface Aviso {
    id: number;
    titulo: string;
    contenido: string;
    target_rol: string;
    created_at: string;
}

export default function AdminNotices() {
    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchAvisos();
    }, []);

    const fetchAvisos = async () => {
        try {
            const data = await getAvisos();
            setAvisos(data || []);
        } catch (error) {
            console.error("Error fetching avisos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        setSending(true);
        try {
            await createAviso({
                titulo: newTitle,
                contenido: newContent,
                target_rol: 'all' // defaulting to all for now as per requirement interpretation
            });
            setNewTitle("");
            setNewContent("");
            await fetchAvisos();
        } catch (error) {
            console.error("Error creating aviso:", error);
            alert("Error al enviar el aviso.");
        } finally {
            setSending(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Avisos a Maestros</h1>

                {/* Create Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5 text-indigo-600" />
                        Nuevo Comunicado
                    </h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ej: Reunión de personal docente"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                            <textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                placeholder="Escriba el contenido del aviso aquí..."
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={sending}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
                            >
                                {sending ? 'Enviando...' : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Publicar Aviso
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* History List */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Historial de Avisos</h2>
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-24 bg-gray-100 rounded-xl"></div>
                            <div className="h-24 bg-gray-100 rounded-xl"></div>
                        </div>
                    ) : avisos.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No hay avisos publicados recientemente.</p>
                    ) : (
                        <div className="space-y-4">
                            {avisos.map((aviso) => (
                                <div key={aviso.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{aviso.titulo}</h3>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {new Date(aviso.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 whitespace-pre-wrap">{aviso.contenido}</p>
                                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                                        <Check className="w-3 h-3" />
                                        <span>Visible para todos los maestros</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
