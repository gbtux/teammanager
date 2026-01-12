<?php

namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private ?bool $completed = false;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $dueDate = null;

    #[ORM\Column(length: 255)]
    private ?string $priority = "Low"; //"Medium" | "High"

    #[ORM\ManyToOne(inversedBy: 'tasks')]
    private ?User $assignee = null;

    #[ORM\ManyToOne(inversedBy: 'tasks')]
    private ?Milestone $milestone = null;

    #[ORM\Column(length: 255)]
    private ?string $status = "To Do";

    /**
     * @var Collection<int, TaskComment>
     */
    #[ORM\OneToMany(targetEntity: TaskComment::class, mappedBy: 'task')]
    private Collection $comments;

    /**
     * @var Collection<int, TaskTag>
     */
    #[ORM\ManyToMany(targetEntity: TaskTag::class)]
    private Collection $tags;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $startDate = null;

    #[ORM\Column(nullable: true)]
    private ?int $workload = null;

    /**
     * @var Collection<int, Workload>
     */
    #[ORM\OneToMany(targetEntity: Workload::class, mappedBy: 'task')]
    private Collection $workloads;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->workloads = new ArrayCollection();
    } //In Progress - Review - Done

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function isCompleted(): ?bool
    {
        return $this->completed;
    }

    public function setCompleted(bool $completed): static
    {
        $this->completed = $completed;

        return $this;
    }

    public function getDueDate(): ?\DateTime
    {
        return $this->dueDate;
    }

    public function setDueDate(?\DateTime $dueDate): static
    {
        $this->dueDate = $dueDate;

        return $this;
    }

    public function getPriority(): ?string
    {
        return $this->priority;
    }

    public function setPriority(string $priority): static
    {
        $this->priority = $priority;

        return $this;
    }

    public function getAssignee(): ?User
    {
        return $this->assignee;
    }

    public function setAssignee(?User $assignee): static
    {
        $this->assignee = $assignee;

        return $this;
    }

    public function getMilestone(): ?Milestone
    {
        return $this->milestone;
    }

    public function setMilestone(?Milestone $milestone): static
    {
        $this->milestone = $milestone;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return Collection<int, TaskComment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(TaskComment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setTask($this);
        }

        return $this;
    }

    public function removeComment(TaskComment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getTask() === $this) {
                $comment->setTask(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, TaskTag>
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(TaskTag $tag): static
    {
        if (!$this->tags->contains($tag)) {
            $this->tags->add($tag);
        }

        return $this;
    }

    public function removeTag(TaskTag $tag): static
    {
        $this->tags->removeElement($tag);

        return $this;
    }

    public function getStartDate(): ?\DateTime
    {
        return $this->startDate;
    }

    public function setStartDate(?\DateTime $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getWorkload(): ?int
    {
        return $this->workload;
    }

    public function setWorkload(?int $workload): static
    {
        $this->workload = $workload;

        return $this;
    }

    /**
     * @return Collection<int, Workload>
     */
    public function getWorkloads(): Collection
    {
        return $this->workloads;
    }

    public function addWorkload(Workload $workload): static
    {
        if (!$this->workloads->contains($workload)) {
            $this->workloads->add($workload);
            $workload->setTask($this);
        }

        return $this;
    }

    public function removeWorkload(Workload $workload): static
    {
        if ($this->workloads->removeElement($workload)) {
            // set the owning side to null (unless already changed)
            if ($workload->getTask() === $this) {
                $workload->setTask(null);
            }
        }

        return $this;
    }
}
