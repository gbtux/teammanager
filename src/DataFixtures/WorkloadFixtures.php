<?php

namespace App\DataFixtures;

use App\Entity\Task;
use App\Entity\Workload;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class WorkloadFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $w1 = new Workload();
        $w1->setYear(2026);
        $w1->setMonth(1);
        $w1->setDays(4);
        $w1->setTask($this->getReference('task1', Task::class));
        $manager->persist($w1);

        $w2 = new Workload();
        $w2->setYear(2026);
        $w2->setMonth(2);
        $w2->setDays(5);
        $w2->setTask($this->getReference('task1', Task::class));
        $manager->persist($w2);


        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            TaskFixtures::class,
        ];
    }
}
