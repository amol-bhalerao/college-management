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
        'parent_page_id',
        'title',
        'hero_title',
        'hero_subtitle',
        'summary_text',
        'cover_image_url',
        'body_html',
        'seo_title',
        'seo_description',
        'is_published',
        'show_on_home',
        'show_in_nav',
        'sort_order',
    ];
}
