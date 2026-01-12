<?php

namespace App\DataFixtures;

use App\Entity\Epic;
use App\Entity\Project;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class EpicFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $e1 = new Epic();
        $e1->setTitle('Epic 1');
        $e1->setDescription('Epic 1 description');
        $e1->setCreationDate(new \DateTime());
        $e1->setCreator($this->getReference('u1', User::class));
        $e1->setResume("Premier Epic");
        $e1->setProject($this->getReference("p1", Project::class));
        $manager->persist($e1);
        $this->addReference('epic1', $e1);
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            ProjectFixtures::class,
        ];
    }
}
