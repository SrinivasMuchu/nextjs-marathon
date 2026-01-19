'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../../config'
import styles from './DesignHub.module.css'
import Loading from '@/Components/CommonJsx/Loaders/Loading'

function DesignHubCategories({ selectedCategory, onCategoryChange }) {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesRes = await axios.get(`${BASE_URL}/v1/cad/get-categories`, {
                    cache: 'no-store',
                })
                
                // Handle different response structures
                const categoriesData = categoriesRes.data?.data?.data || categoriesRes.data?.data || categoriesRes.data || []
                
                // Ensure categories is an array
                const categoriesArray = Array.isArray(categoriesData) ? categoriesData : []
                setCategories(categoriesArray)
            } catch (error) {
                // Error fetching categories
            } finally {
                setLoading(false)
            }
        }
        
        fetchCategories()
    }, [])
    
    if (loading) {
        return (
            // <div className={styles.designHubCategoriesContainer}>
              <Loading />
            // </div>
        )
    }
    
    return (
        <div className={styles.designHubCategoriesContainer}>
            <div className={styles.designHubCategoriesList}>
                {categories.length > 0 ? (
                    categories.map((category) => {
                        const categoryName = category.industry_category_name || category.name
                        const isSelected = selectedCategory === categoryName
                        
                        return (
                            <button 
                                key={category.id || category._id} 
                                className={`${styles.designHubCategoryButton} ${isSelected ? styles.designHubCategoryButtonActive : ''}`}
                                onClick={() => onCategoryChange(categoryName)}
                            >
                                {category.icon && (
                                    <span className={styles.designHubCategoryIcon}>{category.icon}</span>
                                )}
                                <span className={styles.designHubCategoryName}>
                                    {category.name || category.industry_category_label || category.title}
                                </span>
                            </button>
                        )
                    })
                ) : (
                    <p>No categories available</p>
                )}
            </div>
        </div>
    )
}

export default DesignHubCategories