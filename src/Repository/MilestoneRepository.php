<?php

namespace App\Repository;

use App\Entity\Milestone;
use App\Entity\Project;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Milestone>
 */
class MilestoneRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Milestone::class);
    }

    public function findByProjectWithTasks(Project $project): array
    {
        return $this->createQueryBuilder('m')
            ->addSelect('t') // On sélectionne aussi les tâches
            ->leftJoin('m.tasks', 't') // Jointure sur la collection tasks
            ->where('m.project = :project')
            ->setParameter('project', $project)
            ->getQuery()
            ->getResult();
    }
}
