<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    public function __construct(private UserPasswordHasherInterface $userPasswordHasher)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $u1 = new User();
        $u1->setName("Guillaume Bordes");
        $u1->setIsVerified(true);
        $u1->setEmail("gu.bordes@gmail.com");
        $u1->setPassword($this->userPasswordHasher->hashPassword($u1, "password"));
        $u1->setRoles(["ROLE_USER"]);
        $manager->persist($u1);
        $this->addReference("u1", $u1);
        $manager->flush();
    }
}
