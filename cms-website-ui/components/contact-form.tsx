"use client";

import { createContactMessageAction } from "@/actions/create-contact-message";
import { CreateContactMessageFormState } from "@/lib/types";
import { useActionState } from "react";

export default function ContactForm() {
    const initialState: CreateContactMessageFormState = {};

    const [state, dispatch, isPending] = useActionState(createContactMessageAction, initialState);

    if (state.success) {
        return (
            <div className="max-w-md mx-auto m-10 p-6 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center shadow-sm">
                <p className="font-semibold text-lg">{state.success}</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
            <form action={dispatch} className="flex flex-col gap-6 bg-white p-8 m-5 rounded-2xl shadow-xl border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Kapcsolat</h2>
                
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-slate-700 ml-1">Név</label>
                    <input 
                        type="text" 
                        name="Name" 
                        placeholder="Minta János"
                        className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" 
                    />
                    {state.errors?.Name && (
                        <div className="mt-1">
                            {state.errors.Name.map((err, idx) => (
                                <p key={`Name-${idx}`} className="text-red-500 text-xs font-medium italic leading-tight ml-1">{err}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-slate-700 ml-1">Email cím</label>
                    <input 
                        type="email" 
                        name="Email" 
                        placeholder="pelda@email.hu"
                        className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" 
                    />
                    {state.errors?.Email && (
                        <div className="mt-1">
                            {state.errors.Email.map((err, idx) => (
                                <p key={`Email-${idx}`} className="text-red-500 text-xs font-medium italic leading-tight ml-1">{err}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-slate-700 ml-1">Üzenet</label>
                    <textarea 
                        name="Message" 
                        rows={4}
                        placeholder="Miben segíthetek?"
                        className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm resize-none" 
                    />
                    {state.errors?.Message && (
                        <div className="mt-1">
                            {state.errors.Message.map((err, idx) => (
                                <p key={`Message-${idx}`} className="text-red-500 text-xs font-medium italic leading-tight ml-1">{err}</p>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md active:transform active:scale-[0.98]"
                >
                    {isPending ? "Küldés..." : "Üzenet küldése"}
                </button>
            </form>
        </div>
    );
}