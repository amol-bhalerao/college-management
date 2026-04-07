<?php

namespace App\Models;

use CodeIgniter\Model;

class WebsitePageModel extends Model
{
    protected $table = 'website_pages';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;

    protected $allowedFields = [
        'institute_id',
        'slug',
        'nav_label',
        'menu_group',
        'title',
        'hero_title',
        'hero_subtitle',
        'body_html',
        'seo_title',
        'seo_description',
        'is_published',
        'sort_order',
    ];
}
