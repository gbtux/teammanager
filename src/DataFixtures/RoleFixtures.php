<?php

namespace App\DataFixtures;

use App\Entity\Role;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class RoleFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $rcp = new Role();
        $rcp->setName('Responsable Conduite de Projet');
        $manager->persist($rcp);
        $this->addReference('rcp', $rcp);
        $cte = new Role();
        $cte->setName("Correspondant Technique d'Exploitation");
        $manager->persist($cte);
        $this->addReference('cte', $cte);
        $manager->flush();
    }
}
