<?php

namespace App\Models;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;
use MongoDB\BSON\UTCDateTime;

class Operation extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'operations';
    protected $fillable = [
        'code',
        'type',
        'quantity',
        'status',
        'user_id',
        'supplier_id',
        'lot_id'
    ];
    #endregion

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    #region Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lot(): BelongsTo
    {
        return $this->belongsTo(Lot::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
    #endregion

    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at->format('h:i A d/m/Y');
    }

}
