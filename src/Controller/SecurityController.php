<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\InertiaAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Gbtux\InertiaBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    #[Route(path: '/login', name: 'app_login', options: ['expose' => true])]
    public function login(Request $request): Response
    {
        $session = $request->getSession();

        // On récupère notre message simplifié
        $error = $session->get('_security.last_error_message');
        $lastUsername = $session->get('_security.last_username');

        // On nettoie la session après lecture
        $session->remove('_security.last_error_message');
        $session->remove('_security.last_username');

        return $this->inertiaRender('security/Login', [
            'last_username' => $lastUsername,
            'error' => $error,
        ]);
    }

    #[Route(path: '/register', name: 'app_register', options: ['expose' => true])]
    public function register(Request $request,
                             UserPasswordHasherInterface $passwordHasher,
                             EntityManagerInterface $entityManager,
                             Security $security): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);

        if ($request->isMethod('POST')) {
            $data = json_decode($request->getContent(), true);
            $form->submit($data);

            if ($form->isValid()) {
                $user->setPassword($passwordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                ));

                $user->setIsVerified(true);
                $entityManager->persist($user);
                $entityManager->flush();
                return $security->login($user, InertiaAuthenticator::class, 'main');
            }

            // Si invalide, on renvoie les erreurs à Inertia
            return $this->inertiaRender('security/Register', [
                'errors' => $this->getFormErrors($form)
            ]);
        }
        return $this->inertiaRender('security/Register');
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    /**
     * TODO : à mettre dans InertiaBundle
     * @param $form
     * @return array
     */
    private function getFormErrors($form): array
    {
        $errors = [];
        foreach ($form->getErrors(true) as $error) {
            $errors[$error->getOrigin()->getName()] = $error->getMessage();
        }
        return $errors;
    }
}
