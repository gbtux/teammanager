<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260107155424 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE task_task_tag (task_id INT NOT NULL, task_tag_id INT NOT NULL, PRIMARY KEY (task_id, task_tag_id))');
        $this->addSql('CREATE INDEX IDX_2CCBA5488DB60186 ON task_task_tag (task_id)');
        $this->addSql('CREATE INDEX IDX_2CCBA548817BE7C2 ON task_task_tag (task_tag_id)');
        $this->addSql('ALTER TABLE task_task_tag ADD CONSTRAINT FK_2CCBA5488DB60186 FOREIGN KEY (task_id) REFERENCES task (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE task_task_tag ADD CONSTRAINT FK_2CCBA548817BE7C2 FOREIGN KEY (task_tag_id) REFERENCES task_tag (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE task_task_tag DROP CONSTRAINT FK_2CCBA5488DB60186');
        $this->addSql('ALTER TABLE task_task_tag DROP CONSTRAINT FK_2CCBA548817BE7C2');
        $this->addSql('DROP TABLE task_task_tag');
    }
}
