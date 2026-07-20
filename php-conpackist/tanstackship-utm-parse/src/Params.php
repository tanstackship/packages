<?php

declare(strict_types=1);

namespace TanStackShip\UtmParse;

/**
 * UTM Parameters container
 */
final class Params
{
    public ?string $source = null;
    public ?string $medium = null;
    public ?string $campaign = null;
    public ?string $term = null;
    public ?string $content = null;
    public ?string $platform = null;

    public function isEmpty(): bool
    {
        return $this->source === null
            && $this->medium === null
            && $this->campaign === null
            && $this->term === null
            && $this->content === null;
    }

    public function toArray(): array
    {
        return array_filter([
            'source' => $this->source,
            'medium' => $this->medium,
            'campaign' => $this->campaign,
            'term' => $this->term,
            'content' => $this->content,
            'platform' => $this->platform,
        ], fn($v) => $v !== null);
    }
}
