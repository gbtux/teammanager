<?php

namespace App\DataFixtures;

use App\Entity\Milestone;
use App\Entity\Project;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class MilestoneFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $m1 = new Milestone();
        $m1->setProject($this->getReference('p1', Project::class));
        $m1->setTitle('Milestone 1');
        $m1->setDescription('Milestone 1 description');
        $m1->setCreatedBy($this->getReference('u1', User::class));
        $m1->setStartDate(new \DateTime('2026-01-01'));
        $m1->setEndDate(new \DateTime('2026-02-08'));
        $m1->setProgress(20);
        $manager->persist($m1);
        $manager->flush();

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ProjectFixtures::class
        ];
    }
}
