import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProjectConfirmProps } from '@/types/projects';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Routing from "@toyokumo/fos-router";
import routes from '@/fos_routes';
Routing.setRoutingData(routes)

export default function ProjectDeleteConfirm({ project, onClose }: ProjectConfirmProps) {

    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        if (!project) return;
        onClose();
        destroy(Routing.generate('app_projects_destroy', {id: project.id}), {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        // Cette fonction est appelée quand le composant est supprimé du DOM
        return () => {
            document.body.style.pointerEvents = 'auto';
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <AlertDialog open={!!project} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le projet ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer <strong>{project?.name}</strong> ? Cette action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={processing}
                        className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                    >
                        {processing ? 'Suppression...' : 'Confirmer'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
