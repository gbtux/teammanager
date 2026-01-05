<?php

namespace App\Controller;

use App\Form\ContactType;
use Gbtux\InertiaBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'app_home', methods: ['GET'], options: ['expose' => true])]
    public function home(): Response
    {
        return $this->inertiaRender('Home', []);
    }

}
