<?php

namespace App\Controller;

use App\Entity\Project;
use App\Form\ProjectType;
use App\Repository\EpicRepository;
use App\Repository\MilestoneRepository;
use App\Repository\ProjectMemberRepository;
use App\Repository\ProjectRepository;
use App\Repository\RoleRepository;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Gbtux\InertiaBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProjectController extends AbstractController
{
    #[Route('/projects', name: 'app_projects', methods: ['GET'])]
    public function index(ProjectRepository $projectRepository): Response
    {
        $projects = $projectRepository->findAll();
        return $this->inertiaRender('projects/index', [
            "projects" => $projects,
        ]);
    }

    #[Route('/projects/{id}', name: 'app_projects_show', methods: ['GET'], options: ['expose' => true])]
    public function show(Project $project,
                         ProjectMemberRepository $memberRepository,
                         UserRepository $userRepository,
                         RoleRepository $roleRepository,
                         MilestoneRepository $milestoneRepository,
                         TaskRepository $taskRepository,
                         EpicRepository $epicRepository
    ): Response
    {
        $kanbanData = [
            'To Do' => [],
            'In Progress' => [],
            'Review' => [],
            'Done' => []
        ];
        $tasks = $taskRepository->findTasksByProjectForKanban($project);
        foreach ($tasks as $task) {
            $status = $task->getStatus();
            if (isset($kanbanData[$status])) {
                $kanbanData[$status][] = [
                    'id' => $task->getId(),
                    'title' => $task->getTitle(),
                    'description' => $task->getDescription(),
                    'priority' => $task->getPriority(),
                    'dueDate' => $task->getDueDate() ? $task->getDueDate()->format('Y-m-d') : null,
                    'completed' => $task->isCompleted(),
                    'assignee' => $task->getAssignee()->getName(),
                    'milestoneTitle' => $task->getMilestone()->getTitle(),
                    'comments' => $task->getComments()->map(fn($comment) => [
                        'id' => $comment->getId(),
                        'content' => $comment->getContent(),
                    ])->toArray(),
                    'tags' => $task->getTags()->map(fn($tag) => [
                        'id' => $tag->getId(),
                        'label' => $tag->getLabel(),
                    ])->toArray(),
                ];
            }
        }

        $members = $memberRepository->findBy(['project' => $project]);
        $milestones = $milestoneRepository->findByProjectWithTasks($project);
        $epics = $epicRepository->findByProjectWithStoriesCount($project);
        return $this->inertiaRender('projects/show', [
            "project" => $project,
            "members" => $members,
            "all_users" => $userRepository->findAll(),
            "all_roles" => $roleRepository->findAll(),
            'milestones' => array_map(fn($milestone) => [
                'id' => $milestone->getId(),
                'title' => $milestone->getTitle(),
                'description' => $milestone->getDescription(),
                'active' => $milestone->isActive(),
                'status' => $milestone->getStatus(),
                'startDate' => $milestone->getStartDate()->format('Y-m-d'),
                'endDate' => $milestone->getEndDate()->format('Y-m-d'),
                'progress' => $milestone->getProgress(),
                'createdBy' => [
                    'name' => $milestone->getCreatedBy()->getName(),
                ],
                // On ajoute la liste des tâches ici
                'tasks' => $milestone->getTasks()->map(fn($task) => [
                    'id' => $task->getId(),
                    'title' => $task->getTitle(),
                    'description' => $task->getDescription(),
                    'completed' => $task->isCompleted(),
                    'priority' => $task->getPriority(),
                    'status' => $task->getStatus(),
                    'startDate' => $task->getStartDate()->format('Y-m-d'),
                    'dueDate' => $task->getDueDate()->format('Y-m-d'),
                    'assignee' => $task->getAssignee()->getName(),
                    'workloads' => $task->getWorkloads()->map(fn($workload) => [
                        'id' => $workload->getId(),
                        'year' => $workload->getYear(),
                        'month' => $workload->getMonth(),
                        'days' => $workload->getDays(),
                    ])->toArray()
                ])->toArray(),
            ], $milestones),
            'kanban' => $kanbanData,
            'epics' => $epics
        ]);
    }

    #[Route('/projects', name: 'app_projects_store', methods: ['POST'], options: ['expose' => true])]
    public function store(Request $request, EntityManagerInterface $entityManager)
    {
        $project = new Project();
        $form = $this->createForm(ProjectType::class, $project);
        if ($request->isMethod('POST')) {
            $data = json_decode($request->getContent(), true);
            $form->submit($data);

            if ($form->isValid()) {
                $project->setCreatedBy($this->getUser());
                $entityManager->persist($project);
                $entityManager->flush();
                return $this->redirectToRoute('app_projects_show', ['id' => $project->getId()]);
            }
            dd("argh");
        }
        return $this->redirect($request->headers->get('referer'));
    }
}
