import {Attributes, SVGAttributes} from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <div className="flex flex-row items-center gap-2">
            {/* Le Texte */}
            <div className="flex flex-row gap-3 leading-tight">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                    Team<span className="text-blue-600">Manager</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                    Planning & Charge
                </span>
            </div>
        </div>
    );

}
