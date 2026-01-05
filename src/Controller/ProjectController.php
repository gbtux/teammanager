<?php

namespace App\Controller;

use App\Entity\Project;
use App\Form\ProjectType;
use App\Repository\ProjectMemberRepository;
use App\Repository\ProjectRepository;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Gbtux\InertiaBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProjectController extends AbstractController
{
    #[Route('/projects', name: 'app_projects')]
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
                         RoleRepository $roleRepository
    ): Response
    {
        $members = $memberRepository->findBy(['project' => $project]);
        return $this->inertiaRender('projects/show', [
            "project" => $project,
            "members" => $members,
            "all_users" => $userRepository->findAll(),
            "all_roles" => $roleRepository->findAll(),
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
        }
        return null;
    }
}
