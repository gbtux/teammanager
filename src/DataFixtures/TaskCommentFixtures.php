<?php

namespace App\DataFixtures;

use App\Entity\Task;
use App\Entity\TaskComment;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class TaskCommentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $c1 = new TaskComment();
        $c1->setContent("First comment");
        $c1->setTask($this->getReference('task1', Task::class));
        $manager->persist($c1);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            TaskFixtures::class
        ];
    }
}
