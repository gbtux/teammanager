<?php

namespace App\EventListener;

use Gbtux\InertiaBundle\Event\InertiaShareEvent;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener(event: InertiaShareEvent::class)]
class InertiaShareListener
{
    public function __construct(private Security $security) {}

    public function __invoke(InertiaShareEvent $event): void
    {
        // Partager l'utilisateur connecté
        $event->share('auth', [
            'user' => $this->security->getUser() ? [
                'username' => $this->security->getUser()->getUserIdentifier(),
                'email' => $this->security->getUser()->getEmail(),
                'name' => $this->security->getUser()->getName(),
                'avatar' => ''
            ] : null,
        ]);

        // Partager les variables d'environnement (ex: nom de l'app)
        //$event->share('app_name', 'Mon Super Projet');
    }
}
