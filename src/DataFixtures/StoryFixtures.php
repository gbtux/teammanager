<?php

namespace App\DataFixtures;

use App\Entity\Epic;
use App\Entity\Story;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class StoryFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $s1 = new Story();
        $s1->setTitle('Story 1');
        $s1->setDescription('Story 1 description');
        $s1->setEpic($this->getReference('epic1', Epic::class));
        $s1->setCreator($this->getReference("u1", User::class));
        $manager->persist($s1);

        $s2 = new Story();
        $s2->setTitle('Story 2');
        $s2->setDescription('Story 2 description');
        $s2->setEpic($this->getReference('epic1', Epic::class));
        $s2->setCreator($this->getReference("u1", User::class));
        $manager->persist($s2);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            EpicFixtures::class,
        ];
    }
}
