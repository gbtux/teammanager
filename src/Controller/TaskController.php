<?php

namespace App\Controller;

use App\Entity\Task;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class TaskController extends AbstractController
{
    #[Route('/tasks/{id}/status', name: 'app_tasks_update_status', methods: ['PATCH'], options: ['expose' => true])]
    public function updateStatus(Task $task, Request $request, EntityManagerInterface $em)
    {
        $content = json_decode($request->getContent(), true);
        $status = $content['status'] ?? null;

        // On pourrait ajouter ici une validation (ex: in_array($newStatus, ['To Do', ...]))
        $task->setStatus($status);

        // Si le statut passe à "Done", on peut marquer completed à true
        if ($status === 'Done') {
            $task->setCompleted(true);
        }

        $em->flush();

        return $this->redirectToRoute('app_projects_show', ['id' => $task->getMilestone()->getProject()->getId()]); // Inertia rechargera les données automatiquement
    }
}
