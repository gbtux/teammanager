<?php

namespace save;

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

    #[Route('/contact', name: 'app_contact', methods: ['GET','POST'], options: ['expose' => true])]
    public function contact(Request $request): Response
    {
        $form = $this->createForm(ContactType::class);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $this->addFlash('success', 'Your message has been sent.');
            return $this->redirectToRoute('app_home');
        }
        return $this->inertiaRender('Contact');
    }

    #[Route('/about-us', name: 'app_about', methods: ['GET'], options: ['expose' => true])]
    public function about(): Response
    {
        return $this->inertiaRender('About');
    }

}
