<?php

namespace App\DataFixtures;

use App\Entity\Milestone;
use App\Entity\Task;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class TaskFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $t1 = new Task();
        $t1->setTitle('Task 1');
        $t1->setDescription('Task 1 description');
        $t1->setAssignee($this->getReference('u1', User::class));
        $t1->setStartDate(new \DateTime('tomorrow'));
        $t1->setDueDate(new \DateTime('2026-01-15'));
        $t1->setMilestone($this->getReference('milestone1', Milestone::class));
        $t1->setStatus("To Do");
        $t1->setWorkload(5);
        $manager->persist($t1);
        $this->addReference('task1', $t1);

        $t2 = new Task();
        $t2->setTitle('Task 2');
        $t2->setDescription('Task 2 description');
        $t2->setAssignee($this->getReference('u1', User::class));
        $t2->setStartDate(new \DateTime('tomorrow'));
        $t2->setDueDate(new \DateTime('2026-01-22'));
        $t2->setMilestone($this->getReference('milestone1', Milestone::class));
        $t2->setStatus("Review");
        $t2->setWorkload(4);
        $manager->persist($t2);

        $t3 = new Task();
        $t3->setTitle('Task 3');
        $t3->setDescription('Task 3 description');
        $t3->setAssignee($this->getReference('u1', User::class));
        $t3->setStartDate(new \DateTime('tomorrow'));
        $t3->setDueDate(new \DateTime('2026-01-29'));
        $t3->setMilestone($this->getReference('milestone1', Milestone::class));
        $t3->setStatus("In Progress");
        $t3->setWorkload(8);
        $manager->persist($t3);

        $t4 = new Task();
        $t4->setTitle('Task 4');
        $t4->setDescription('Task 4 description');
        $t4->setAssignee($this->getReference('u1', User::class));
        $t4->setStartDate(new \DateTime('tomorrow'));
        $t4->setDueDate(new \DateTime('2026-02-08'));
        $t4->setMilestone($this->getReference('milestone1', Milestone::class));
        $t4->setStatus("Done");
        $t4->setWorkload(2);
        $manager->persist($t4);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            MilestoneFixtures::class,
        ];
    }
}
