<?php

namespace App\DataFixtures;

use App\Entity\Project;
use App\Entity\ProjectMember;
use App\Entity\Role;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ProjectMemberFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $pm1 = new ProjectMember();
        $pm1->setMember($this->getReference('u1', User::class));
        $pm1->setRole($this->getReference('rcp', Role::class));
        $pm1->setProject($this->getReference('p1', Project::class));
        $manager->persist($pm1);

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
