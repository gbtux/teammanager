<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260107155308 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE task_tag DROP CONSTRAINT fk_6c0b4f048db60186');
        $this->addSql('DROP INDEX idx_6c0b4f048db60186');
        $this->addSql('ALTER TABLE task_tag DROP task_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE task_tag ADD task_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE task_tag ADD CONSTRAINT fk_6c0b4f048db60186 FOREIGN KEY (task_id) REFERENCES task (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_6c0b4f048db60186 ON task_tag (task_id)');
    }
}
