<?php

namespace App\DataFixtures;

use App\Entity\Task;
use App\Entity\TaskTag;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class TaskTagFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $tag1 = new TaskTag();
        $tag1->setLabel("Backend");
        $manager->persist($tag1);

        $tag2 = new TaskTag();
        $tag2->setLabel("Frontend");
        $manager->persist($tag2);
        $tag3 = new TaskTag();
        $tag3->setLabel("Data");
        $manager->persist($tag3);


        $task1 = $this->getReference('task1', Task::class);
        $task1->getTags()->add($tag1);
        $task1->getTags()->add($tag2);
        $manager->persist($task1);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
          TaskFixtures::class
        ];
    }
}
