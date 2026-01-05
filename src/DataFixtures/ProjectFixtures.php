<?php

namespace App\DataFixtures;

use App\Entity\Project;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ProjectFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $p1 = new Project();
        $p1->setName("Project 1");
        $p1->setDescription("Project 1 description");
        $p1->setCreatedBy($this->getReference("u1", User::class));
        $manager->persist($p1);
        $this->addReference('p1', $p1);
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
