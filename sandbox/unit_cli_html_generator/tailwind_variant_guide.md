# Tailwind Variant Guide

Generated with `gpt-4o-mini` from the section registry.

## `top-nav` / `simple`

### Example 1: Minimalist Top Navigation

**When To Use**: Use this when you want a clean, distraction-free navigation that highlights your brand name and essential links.

**Why It Works**: The minimalist design creates a professional look, allowing users to focus on navigation without unnecessary elements. The use of adequate spacing and contrast ensures readability and accessibility.

**Tailwind Notes**:
- Flexbox for horizontal alignment
- Responsive padding and margins for mobile devices
- Contrast colors for links to enhance visibility

```html
<section class='bg-white shadow-md'>
  <div class='container mx-auto px-4 py-3 flex justify-between items-center'>
    <h1 class='text-xl font-bold text-gray-800'>MySite</h1>
    <nav>
      <ul class='flex space-x-4'>
        <li><a href='#' class='text-gray-600 hover:text-blue-500 transition'>Home</a></li>
        <li><a href='#' class='text-gray-600 hover:text-blue-500 transition'>About</a></li>
        <li><a href='#' class='text-gray-600 hover:text-blue-500 transition'>Services</a></li>
        <li><a href='#' class='text-gray-600 hover:text-blue-500 transition'>Contact</a></li>
      </ul>
    </nav>
  </div>
</section>
```

### Example 2: Bold and Engaging Top Navigation

**When To Use**: Ideal for brands that want to make a strong impression with bold typography and colors, while still maintaining usability.

**Why It Works**: The bold typography and vibrant colors draw attention, which is effective for marketing sites. The layout ensures that the navigation remains intuitive and user-friendly.

**Tailwind Notes**:
- Bold text for brand name to enhance recognition
- Use of hover effects for interactive feedback
- Color contrast for accessibility compliance

```html
<section class='bg-blue-600'>
  <div class='container mx-auto px-6 py-4 flex justify-between items-center'>
    <h1 class='text-2xl font-extrabold text-white'>BrandName</h1>
    <nav>
      <ul class='flex space-x-6'>
        <li><a href='#' class='text-white hover:text-yellow-400 transition'>Home</a></li>
        <li><a href='#' class='text-white hover:text-yellow-400 transition'>Features</a></li>
        <li><a href='#' class='text-white hover:text-yellow-400 transition'>Pricing</a></li>
        <li><a href='#' class='text-white hover:text-yellow-400 transition'>Support</a></li>
      </ul>
    </nav>
  </div>
</section>
```

### Example 3: Sleek and Functional Top Navigation with CTA

**When To Use**: Best for sites that want to integrate a call-to-action directly into the navigation for conversions.

**Why It Works**: The inclusion of a prominent CTA button within the navigation encourages user action while maintaining a clean look. The layout is responsive and adapts well to different screen sizes.

**Tailwind Notes**:
- Flexbox for alignment and spacing
- Distinct CTA button styling to stand out
- Responsive design for mobile compatibility

```html
<section class='bg-gray-100'>
  <div class='container mx-auto px-4 py-3 flex justify-between items-center'>
    <h1 class='text-lg font-semibold text-gray-900'>SiteName</h1>
    <nav>
      <ul class='flex space-x-5'>
        <li><a href='#' class='text-gray-700 hover:text-gray-900 transition'>Home</a></li>
        <li><a href='#' class='text-gray-700 hover:text-gray-900 transition'>Products</a></li>
        <li><a href='#' class='text-gray-700 hover:text-gray-900 transition'>Blog</a></li>
        <li><a href='#' class='text-gray-700 hover:text-gray-900 transition'>Contact</a></li>
      </ul>
    </nav>
    <a href='#' class='ml-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'>Get Started</a>
  </div>
</section>
```

## `top-nav` / `with-cta`

### Example 1: Modern Minimalist Navigation

**When To Use**: When you want a clean, distraction-free navigation that highlights the call to action prominently.

**Why It Works**: This design emphasizes clarity and simplicity, allowing users to focus on the important links and the CTA. The use of ample spacing and contrasting colors makes the navigation easy to read and interact with.

**Tailwind Notes**:
- Utilizes flexbox for horizontal alignment of links and CTA.
- Responsive design ensures the navigation adjusts gracefully on smaller screens.
- Hover effects on links enhance interactivity.

```html
<section class='bg-white shadow-md py-4 px-6'><div class='container mx-auto flex justify-between items-center'><div class='text-xl font-semibold text-gray-800'>SiteName</div><nav class='flex space-x-4'><a href='#' class='text-gray-600 hover:text-blue-600 transition duration-200'>Home</a><a href='#' class='text-gray-600 hover:text-blue-600 transition duration-200'>About</a><a href='#' class='text-gray-600 hover:text-blue-600 transition duration-200'>Services</a><a href='#' class='text-gray-600 hover:text-blue-600 transition duration-200'>Contact</a></nav><a href='#' class='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200'>Get Started</a></div></section>
```

### Example 2: Bold Navigation with Emphasized CTA

**When To Use**: Ideal for a landing page where the CTA needs to stand out immediately to drive conversions.

**Why It Works**: The bold color scheme and large CTA button draw attention immediately. The layout is structured to guide users' eyes from the site name to the navigation links and finally to the CTA.

**Tailwind Notes**:
- Strong color contrast between background and text enhances readability.
- Large button size improves clickability on mobile devices.
- Flexbox layout ensures even spacing and alignment.

```html
<section class='bg-gray-900 text-white py-6 px-8'><div class='container mx-auto flex justify-between items-center'><div class='text-2xl font-bold'>SiteName</div><nav class='flex space-x-6'><a href='#' class='hover:text-blue-400 transition duration-200'>Home</a><a href='#' class='hover:text-blue-400 transition duration-200'>Features</a><a href='#' class='hover:text-blue-400 transition duration-200'>Pricing</a><a href='#' class='hover:text-blue-400 transition duration-200'>Support</a></nav><a href='#' class='bg-blue-500 text-white text-lg px-6 py-3 rounded-full hover:bg-blue-600 transition duration-200'>Sign Up Now</a></div></section>
```

### Example 3: Responsive Navigation with Dropdown

**When To Use**: When you have multiple links and want to ensure a clean layout that adapts to different screen sizes.

**Why It Works**: The dropdown menu keeps the navigation tidy while providing access to additional links. The responsive design ensures usability across devices, with the CTA remaining prominent.

**Tailwind Notes**:
- Dropdown is hidden on mobile but can be toggled for access.
- Flexbox and responsive utilities ensure the layout adapts well.
- Hover and focus states improve accessibility.

```html
<section class='bg-white shadow-lg py-4 px-6'><div class='container mx-auto flex justify-between items-center'><div class='text-xl font-semibold text-gray-800'>SiteName</div><nav class='relative'><div class='hidden md:flex space-x-4'><a href='#' class='text-gray-600 hover:text-blue-600 transition duration-200'>Home</a><a href='#' class='text-gray-600 hover:text-blue-600 transition duration-200'>Blog</a><div class='relative'><button class='text-gray-600 hover:text-blue-600 transition duration-200'>More</button><div class='absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block'><a href='#' class='block px-4 py-2 text-gray-700 hover:bg-blue-100'>Link 1</a><a href='#' class='block px-4 py-2 text-gray-700 hover:bg-blue-100'>Link 2</a></div></div></div></nav><a href='#' class='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200'>Get Started</a></div></section>
```

## `top-nav` / `with-announcement`

### Example 1: Top Navigation with Announcement Bar

**When To Use**: Use this layout when you need to highlight a key announcement or promotion while maintaining easy navigation for users.

**Why It Works**: The combination of a prominent announcement bar with contrasting colors and a clean navigation layout ensures that users can easily notice important information while navigating the site. The use of spacing and typography helps create a clear hierarchy.

**Tailwind Notes**:
- bg-gray-800 for the nav background creates a strong contrast with white text.
- Using text-lg and font-bold for the site name emphasizes branding.
- Flexbox utilities ensure a responsive layout that adapts to different screen sizes.

```html
<section class='bg-gray-800 text-white'>
  <div class='bg-yellow-400 p-2 text-center font-semibold'>
    Limited Time Offer: Free Shipping on Orders Over $50!
  </div>
  <nav class='flex justify-between items-center p-4'>
    <div class='text-lg font-bold'>MySite</div>
    <ul class='flex space-x-4'>
      <li><a href='#' class='hover:text-yellow-300'>Home</a></li>
      <li><a href='#' class='hover:text-yellow-300'>About</a></li>
      <li><a href='#' class='hover:text-yellow-300'>Services</a></li>
      <li><a href='#' class='hover:text-yellow-300'>Contact</a></li>
    </ul>
  </nav>
</section>
```

### Example 2: Compact Navigation with Promotional Announcement

**When To Use**: Ideal for mobile-first designs where space is limited but important announcements still need to be highlighted.

**Why It Works**: The compact layout utilizes a stacked design that maximizes space, while the announcement bar remains prominent. The use of rounded corners and shadows adds a modern touch, enhancing visual appeal.

**Tailwind Notes**:
- Using rounded-md and shadow-lg on the announcement bar gives it a card-like appearance.
- Flex-wrap on the navigation items allows for better adaptability on smaller screens.
- A contrasting color for the announcement bar ensures it stands out without overwhelming the navigation.

```html
<section class='bg-white'>
  <div class='bg-blue-500 p-3 text-center text-white rounded-md shadow-lg'>
    New Year Sale: 30% Off All Products!
  </div>
  <nav class='flex flex-wrap justify-between items-center p-4 bg-gray-900 text-white'>
    <div class='text-xl font-bold'>MySite</div>
    <ul class='flex space-x-2'>
      <li><a href='#' class='hover:text-blue-300'>Home</a></li>
      <li><a href='#' class='hover:text-blue-300'>Shop</a></li>
      <li><a href='#' class='hover:text-blue-300'>Blog</a></li>
      <li><a href='#' class='hover:text-blue-300'>Contact</a></li>
    </ul>
  </nav>
</section>
```

### Example 3: Elegant Navigation with Seasonal Announcement

**When To Use**: Best for sites that want to maintain a sophisticated look while still promoting seasonal offers or important messages.

**Why It Works**: This design employs a minimalist aesthetic with a focus on typography and subtle colors. The announcement bar's muted tone complements the navigation, creating a cohesive look while still drawing attention.

**Tailwind Notes**:
- Using bg-gray-200 for the announcement bar provides a soft contrast with the darker navigation background.
- Text-gray-800 ensures readability without harsh contrast, maintaining a sophisticated appearance.
- Responsive padding and margin classes ensure the layout adapts beautifully across devices.

```html
<section class='bg-gray-900 text-gray-100'>
  <div class='bg-gray-200 p-3 text-center'>
    Spring Sale: 20% Off All Items! Shop Now!
  </div>
  <nav class='flex justify-between items-center p-4'>
    <div class='text-xl font-semibold'>MySite</div>
    <ul class='flex space-x-6'>
      <li><a href='#' class='hover:text-gray-400'>Home</a></li>
      <li><a href='#' class='hover:text-gray-400'>Products</a></li>
      <li><a href='#' class='hover:text-gray-400'>Support</a></li>
      <li><a href='#' class='hover:text-gray-400'>Contact</a></li>
    </ul>
  </nav>
</section>
```

## `top-nav` / `transparent`

### Example 1: Minimalist Transparent Navigation

**When To Use**: Use this when you want a clean, unobtrusive navigation that allows the background content to shine through.

**Why It Works**: This design emphasizes clarity and simplicity, making it easy for users to navigate while keeping the focus on the content. The transparent background with subtle shadows adds depth without overwhelming the visual hierarchy.

**Tailwind Notes**:
- Use of `bg-transparent` for a seamless look with the background.
- Incorporation of `shadow-md` for depth without distraction.
- Responsive design with `flex` for alignment and spacing.

```html
<section class='bg-transparent fixed top-0 left-0 w-full z-10 shadow-md py-4 px-8 flex justify-between items-center'>
  <div class='text-2xl font-bold text-white'>SiteName</div>
  <nav class='space-x-4'>
    <a href='#' class='text-white hover:text-gray-300 transition'>Home</a>
    <a href='#' class='text-white hover:text-gray-300 transition'>About</a>
    <a href='#' class='text-white hover:text-gray-300 transition'>Services</a>
    <a href='#' class='text-white hover:text-gray-300 transition'>Contact</a>
  </nav>
</section>
```

### Example 2: Transparent Navigation with Call to Action

**When To Use**: Ideal for landing pages that require a strong call to action alongside navigation links.

**Why It Works**: The combination of navigation and a prominent CTA creates a clear path for user engagement. The use of contrasting colors for the CTA button ensures it stands out against the transparent background.

**Tailwind Notes**:
- Utilizes `bg-transparent` for a clean look that integrates with the page background.
- The `text-white` color scheme ensures high visibility on various backgrounds.
- Responsive flexbox layout for easy alignment and spacing adjustments.

```html
<section class='bg-transparent fixed top-0 left-0 w-full z-10 shadow-lg py-4 px-8 flex justify-between items-center'>
  <div class='text-2xl font-bold text-white'>SiteName</div>
  <nav class='space-x-4'>
    <a href='#' class='text-white hover:text-gray-300 transition'>Home</a>
    <a href='#' class='text-white hover:text-gray-300 transition'>About</a>
    <a href='#' class='text-white hover:text-gray-300 transition'>Services</a>
    <a href='#' class='text-white hover:text-gray-300 transition'>Contact</a>
  </nav>
  <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition'>Get Started</a>
</section>
```

### Example 3: Responsive Transparent Navigation with Dropdown

**When To Use**: Use this for websites needing a more complex navigation structure, such as those with dropdown menus.

**Why It Works**: This design maintains a clean look while providing additional navigation options through dropdowns. The transparent background keeps the focus on the content, while the dropdowns enhance usability.

**Tailwind Notes**:
- Employs `bg-transparent` for a seamless integration with the page.
- Dropdowns are styled using `absolute` positioning to keep them visually distinct.
- Flex layout ensures that items are appropriately spaced and aligned.

```html
<section class='bg-transparent fixed top-0 left-0 w-full z-10 shadow-md py-4 px-8 flex justify-between items-center'>
  <div class='text-2xl font-bold text-white'>SiteName</div>
  <nav class='relative'>
    <ul class='flex space-x-4'>
      <li><a href='#' class='text-white hover:text-gray-300 transition'>Home</a></li>
      <li class='relative group'>
        <a href='#' class='text-white hover:text-gray-300 transition'>Services</a>
        <ul class='absolute left-0 hidden mt-2 w-40 bg-white shadow-lg group-hover:block'>
          <li><a href='#' class='block px-4 py-2 text-gray-800 hover:bg-gray-100'>Web Design</a></li>
          <li><a href='#' class='block px-4 py-2 text-gray-800 hover:bg-gray-100'>SEO</a></li>
          <li><a href='#' class='block px-4 py-2 text-gray-800 hover:bg-gray-100'>Marketing</a></li>
        </ul>
      </li>
      <li><a href='#' class='text-white hover:text-gray-300 transition'>Contact</a></li>
    </ul>
  </nav>
</section>
```

## `top-nav` / `sticky`

### Example 1: Minimalist Sticky Navigation

**When To Use**: Use this example for a clean, modern website that prioritizes content with a straightforward navigation structure.

**Why It Works**: The use of a transparent background with a shadow on scroll creates a clear visual hierarchy, while the spacing and typography ensure readability and accessibility.

**Tailwind Notes**:
- bg-transparent on initial load for a minimalist look
- shadow-lg on scroll for depth
- flex and justify-between for balanced layout

```html
<header class='sticky top-0 z-50 bg-transparent transition-all duration-300 shadow-none' onscroll='this.classList.toggle("shadow-lg", window.scrollY > 0)'>
  <div class='container mx-auto px-4 py-4 flex justify-between items-center'>
    <h1 class='text-2xl font-bold text-gray-900'>SiteName</h1>
    <nav class='space-x-4'>
      <a href='#' class='text-gray-700 hover:text-blue-600 transition duration-200'>Home</a>
      <a href='#' class='text-gray-700 hover:text-blue-600 transition duration-200'>About</a>
      <a href='#' class='text-gray-700 hover:text-blue-600 transition duration-200'>Services</a>
      <a href='#' class='text-gray-700 hover:text-blue-600 transition duration-200'>Contact</a>
    </nav>
  </div>
</header>
```

### Example 2: Bold Sticky Navigation with Call to Action

**When To Use**: Ideal for marketing sites that need to emphasize a specific action, such as signing up or making a purchase.

**Why It Works**: The strong color contrast for the CTA button draws attention, while the well-defined sections and padding enhance usability and aesthetics.

**Tailwind Notes**:
- bg-white for a strong contrast against the content
- rounded-full for the CTA button for a modern look
- flex-grow for the nav links to evenly space items

```html
<header class='sticky top-0 z-50 bg-white shadow-md'>
  <div class='container mx-auto px-6 py-4 flex justify-between items-center'>
    <h1 class='text-2xl font-bold text-gray-800'>SiteName</h1>
    <nav class='flex-grow space-x-6'>
      <a href='#' class='text-gray-800 hover:text-blue-500'>Home</a>
      <a href='#' class='text-gray-800 hover:text-blue-500'>Features</a>
      <a href='#' class='text-gray-800 hover:text-blue-500'>Pricing</a>
      <a href='#' class='text-gray-800 hover:text-blue-500'>Support</a>
    </nav>
    <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-200'>Get Started</a>
  </div>
</header>
```

### Example 3: Responsive Sticky Navigation with Dropdown

**When To Use**: Best for websites with multiple categories or services that require a dropdown for better organization.

**Why It Works**: The dropdown enhances user experience by providing additional options without cluttering the navigation bar, while responsive design ensures usability on all devices.

**Tailwind Notes**:
- flex-wrap for responsive behavior
- group and hidden for dropdown functionality
- transition duration for smooth dropdown appearance

```html
<header class='sticky top-0 z-50 bg-gray-800 text-white'>
  <div class='container mx-auto px-4 py-4 flex flex-wrap justify-between items-center'>
    <h1 class='text-2xl font-bold'>SiteName</h1>
    <nav class='flex space-x-4'>
      <div class='relative group'>
        <button class='focus:outline-none'>Products</button>
        <div class='absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg hidden group-hover:block'>
          <a href='#' class='block px-4 py-2 hover:bg-gray-200'>Product 1</a>
          <a href='#' class='block px-4 py-2 hover:bg-gray-200'>Product 2</a>
          <a href='#' class='block px-4 py-2 hover:bg-gray-200'>Product 3</a>
        </div>
      </div>
      <a href='#' class='hover:text-gray-400'>About</a>
      <a href='#' class='hover:text-gray-400'>Contact</a>
    </nav>
  </div>
</header>
```

## `centered-nav` / `logo-center`

### Example 1: Centered Navigation with Logo and Links

**When To Use**: Use this layout for a clean and modern navigation bar on landing pages where the logo needs to be prominently displayed.

**Why It Works**: The centered logo draws immediate attention, while the evenly spaced links provide a balanced navigation experience. The use of contrast and spacing ensures readability and usability across devices.

**Tailwind Notes**:
- Utilizes flexbox for centering and spacing.
- Responsive design adapts to different screen sizes.
- Hover effects on links enhance interactivity.

```html
<section class='bg-white shadow-md py-4'><div class='container mx-auto flex justify-center items-center'><div class='flex items-center'><img src='logo.png' alt='Site Name' class='h-10 mr-6'><nav class='flex space-x-4'><a href='#' class='text-gray-700 hover:text-blue-500 transition duration-200'>Home</a><a href='#' class='text-gray-700 hover:text-blue-500 transition duration-200'>About</a><a href='#' class='text-gray-700 hover:text-blue-500 transition duration-200'>Services</a><a href='#' class='text-gray-700 hover:text-blue-500 transition duration-200'>Contact</a></nav></div></div></section>
```

### Example 2: Centered Navigation with Call to Action

**When To Use**: Ideal for landing pages that require a strong call to action alongside navigation links, ensuring users are directed towards a primary goal.

**Why It Works**: The prominent CTA button stands out against the navigation links, encouraging user interaction. The layout maintains a clean aesthetic while guiding the user’s attention effectively.

**Tailwind Notes**:
- Highlights the CTA with contrasting colors.
- Maintains spacing and alignment for a polished look.
- Responsive design ensures usability on all devices.

```html
<section class='bg-gray-100 py-6'><div class='container mx-auto flex justify-between items-center'><img src='logo.png' alt='Site Name' class='h-12'><nav class='flex space-x-6'><a href='#' class='text-gray-800 hover:text-blue-600 transition duration-300'>Home</a><a href='#' class='text-gray-800 hover:text-blue-600 transition duration-300'>Features</a><a href='#' class='text-gray-800 hover:text-blue-600 transition duration-300'>Pricing</a></nav><a href='#' class='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300'>Get Started</a></div></section>
```

## `centered-nav` / `links-center`

### Example 1: Centered Navigation with Logo and Links

**When To Use**: When you want to create a prominent navigation section that highlights your brand and provides easy access to key links.

**Why It Works**: This design uses a centered layout to draw attention to the site name and links. The spacing and contrast make it easy to read and navigate, while the responsive behavior ensures usability on all devices.

**Tailwind Notes**:
- Flexbox is used for centering the content both vertically and horizontally.
- The use of text colors and hover states enhances interactivity.
- Responsive padding ensures that the section looks good on all screen sizes.

```html
<section class='bg-white py-6 shadow-md'>
  <div class='container mx-auto flex flex-col items-center'>
    <h1 class='text-3xl font-bold text-gray-800 mb-4'>SiteName</h1>
    <nav class='flex space-x-6'>
      <a href='#' class='text-gray-600 hover:text-blue-600 transition'>Home</a>
      <a href='#' class='text-gray-600 hover:text-blue-600 transition'>About</a>
      <a href='#' class='text-gray-600 hover:text-blue-600 transition'>Services</a>
      <a href='#' class='text-gray-600 hover:text-blue-600 transition'>Contact</a>
    </nav>
  </div>
</section>
```

### Example 2: Centered Navigation with Call to Action

**When To Use**: Ideal for landing pages where you want to emphasize a primary action alongside navigation links.

**Why It Works**: The combination of navigation links and a prominent CTA button creates a clear path for users. The use of contrasting colors for the button draws attention and encourages interaction.

**Tailwind Notes**:
- The CTA button is styled with a contrasting color and rounded corners for emphasis.
- Flexbox is used to align the elements, ensuring a clean and organized layout.
- Hover effects on links and the button enhance user engagement.

```html
<section class='bg-gray-50 py-8'>
  <div class='container mx-auto flex flex-col items-center'>
    <h1 class='text-4xl font-bold text-gray-900 mb-6'>Welcome to SiteName</h1>
    <nav class='flex space-x-8 mb-4'>
      <a href='#' class='text-gray-700 hover:text-blue-500 transition'>Home</a>
      <a href='#' class='text-gray-700 hover:text-blue-500 transition'>Features</a>
      <a href='#' class='text-gray-700 hover:text-blue-500 transition'>Pricing</a>
      <a href='#' class='text-gray-700 hover:text-blue-500 transition'>Support</a>
    </nav>
    <a href='#' class='bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition'>Get Started</a>
  </div>
</section>
```

### Example 3: Centered Navigation with Social Links

**When To Use**: When you want to incorporate social media links alongside your main navigation, ideal for brands that leverage social presence.

**Why It Works**: This layout combines navigation with social links, using icons for visual appeal. The consistent spacing and alignment create a polished look, while the social icons provide a modern touch.

**Tailwind Notes**:
- Uses Font Awesome for social icons, enhancing visual interest.
- Flexbox is utilized to keep navigation and social links aligned and spaced evenly.
- Responsive design ensures that the section remains functional on all devices.

```html
<section class='bg-white py-4 shadow-sm'>
  <div class='container mx-auto flex flex-col items-center'>
    <h1 class='text-2xl font-semibold text-gray-800 mb-3'>SiteName</h1>
    <nav class='flex space-x-4 mb-2'>
      <a href='#' class='text-gray-600 hover:text-blue-600 transition'>Home</a>
      <a href='#' class='text-gray-600 hover:text-blue-600 transition'>Blog</a>
      <a href='#' class='text-gray-600 hover:text-blue-600 transition'>Gallery</a>
    </nav>
    <div class='flex space-x-4'>
      <a href='#' class='text-gray-600 hover:text-blue-600 transition'><i class='fab fa-facebook'></i></a>
      <a href='#' class='text-gray-600 hover:text-blue-600 transition'><i class='fab fa-twitter'></i></a>
      <a href='#' class='text-gray-600 hover:text-blue-600 transition'><i class='fab fa-instagram'></i></a>
    </div>
  </div>
</section>
```

## `centered-nav` / `cta-balanced`

### Example 1: Centered Navigation with Call to Action

**When To Use**: Use this example for a landing page where you want to direct users to key actions while providing easy navigation.

**Why It Works**: The combination of centered alignment and bold CTAs helps draw attention to important actions. The use of contrasting colors ensures that the CTAs stand out against the background.

**Tailwind Notes**:
- Flex utilities ensure proper alignment and spacing.
- Text utilities enhance readability and hierarchy.
- Responsive utilities make the section adaptable to different screen sizes.

```html
<section class='bg-gray-100 py-12'><div class='container mx-auto text-center'><h1 class='text-3xl font-bold mb-4'>Welcome to Our Service</h1><p class='text-lg text-gray-700 mb-8'>Discover amazing features and benefits.</p><div class='flex justify-center space-x-4'><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 transition duration-300'>Get Started</a><a href='#' class='text-blue-600 border border-blue-600 py-2 px-4 rounded hover:bg-blue-600 hover:text-white transition duration-300'>Learn More</a></div><nav class='mt-8'><ul class='flex justify-center space-x-6'><li><a href='#' class='text-gray-600 hover:text-blue-600'>Home</a></li><li><a href='#' class='text-gray-600 hover:text-blue-600'>Features</a></li><li><a href='#' class='text-gray-600 hover:text-blue-600'>Pricing</a></li><li><a href='#' class='text-gray-600 hover:text-blue-600'>Contact</a></li></ul></nav></div></section>
```

### Example 2: Promotional Centered Navigation with Emphasized CTAs

**When To Use**: Ideal for a promotional campaign where you want to highlight specific actions while maintaining a clean navigation structure.

**Why It Works**: The layout allows for a clear visual hierarchy with a prominent headline and strategically placed CTAs. The use of background color and spacing creates a distinct section that captures user attention.

**Tailwind Notes**:
- Background and text color choices enhance visibility and engagement.
- Padding and margin utilities create breathing space around elements.
- Hover effects on links improve interactivity and user experience.

```html
<section class='bg-white py-16'><div class='container mx-auto text-center'><h1 class='text-4xl font-extrabold mb-6'>Join Our Community</h1><p class='text-xl text-gray-600 mb-10'>Sign up today and start your journey.</p><div class='flex justify-center space-x-6'><a href='#' class='bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300'>Sign Up Now</a><a href='#' class='text-green-500 border border-green-500 py-3 px-6 rounded-lg hover:bg-green-500 hover:text-white transition duration-300'>Explore Features</a></div><nav class='mt-10'><ul class='flex justify-center space-x-8'><li><a href='#' class='text-gray-800 hover:text-green-500'>About Us</a></li><li><a href='#' class='text-gray-800 hover:text-green-500'>Services</a></li><li><a href='#' class='text-gray-800 hover:text-green-500'>Testimonials</a></li><li><a href='#' class='text-gray-800 hover:text-green-500'>Support</a></li></ul></nav></div></section>
```

## `split-nav` / `logo-left`

### Example 1: Simple Navigation Bar

**When To Use**: Use this example for a clean and straightforward navigation bar that emphasizes the brand logo on the left.

**Why It Works**: The layout is clear and easy to navigate, with ample spacing and contrasting colors that highlight the links. The logo is prominent, establishing brand identity right away.

**Tailwind Notes**:
- Flexbox layout ensures items are aligned properly.
- Padding and margin create a spacious feel.
- Hover effects on links enhance interactivity.

```html
<section class='bg-white shadow-md'><div class='container mx-auto flex items-center justify-between p-4'><div class='text-xl font-bold text-gray-800'>MyBrand</div><nav class='flex space-x-6'><a href='#' class='text-gray-600 hover:text-blue-500 transition'>Home</a><a href='#' class='text-gray-600 hover:text-blue-500 transition'>About</a><a href='#' class='text-gray-600 hover:text-blue-500 transition'>Services</a><a href='#' class='text-gray-600 hover:text-blue-500 transition'>Contact</a></nav></div></section>
```

### Example 2: Navigation Bar with Call-to-Action

**When To Use**: This example is suitable when you want to include a prominent call-to-action button alongside the navigation links.

**Why It Works**: The CTA button stands out due to contrasting colors and rounded edges, encouraging user interaction. The layout remains balanced with the logo on the left and links on the right.

**Tailwind Notes**:
- The button uses a distinct color to draw attention.
- Responsive design ensures usability on mobile devices.
- Flexbox allows for easy alignment of elements.

```html
<section class='bg-gray-100'><div class='container mx-auto flex items-center justify-between p-4'><div class='text-2xl font-semibold text-gray-900'>MyBrand</div><nav class='flex space-x-6'><a href='#' class='text-gray-700 hover:text-blue-600 transition'>Home</a><a href='#' class='text-gray-700 hover:text-blue-600 transition'>About</a><a href='#' class='text-gray-700 hover:text-blue-600 transition'>Services</a><a href='#' class='text-gray-700 hover:text-blue-600 transition'>Contact</a></nav><a href='#' class='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'>Get Started</a></div></section>
```

### Example 3: Responsive Logo-Left Navigation with Dropdown

**When To Use**: Ideal for sites needing a more complex navigation structure, including dropdowns for additional links.

**Why It Works**: The dropdown menu provides an organized way to present additional links without cluttering the main navigation. The design remains clean and user-friendly across devices.

**Tailwind Notes**:
- Dropdowns are styled for visibility and accessibility.
- Responsive classes ensure the layout adapts to screen sizes.
- Hover and focus states enhance usability.

```html
<section class='bg-white shadow-lg'><div class='container mx-auto flex items-center justify-between p-4'><div class='text-xl font-bold text-gray-800'>MyBrand</div><nav class='relative'><div class='flex space-x-6'><a href='#' class='text-gray-600 hover:text-blue-500 transition'>Home</a><div class='relative group'><button class='text-gray-600 hover:text-blue-500 transition'>Services</button><div class='absolute left-0 hidden bg-white border rounded-md group-hover:block'><a href='#' class='block px-4 py-2 text-gray-700 hover:bg-gray-100'>Web Design</a><a href='#' class='block px-4 py-2 text-gray-700 hover:bg-gray-100'>SEO</a></div></div><a href='#' class='text-gray-600 hover:text-blue-500 transition'>About</a><a href='#' class='text-gray-600 hover:text-blue-500 transition'>Contact</a></div></nav></div></section>
```

## `split-nav` / `logo-center`

### Example 1: Centered Logo with Navigation Links

**When To Use**: Use this layout for a landing page where the brand's identity is central and you want to guide users to key sections of the site.

**Why It Works**: The centered logo creates a strong brand presence while the evenly spaced navigation links provide clear pathways for users, enhancing usability and visual balance.

**Tailwind Notes**:
- Flexbox utilities ensure the logo and links are properly aligned and spaced.
- Responsive utilities allow the layout to adapt seamlessly on different screen sizes.
- Hover and focus states on links enhance interactivity and accessibility.

```html
<section class='bg-white py-6 px-4 md:px-8'>
  <div class='container mx-auto flex justify-between items-center'>
    <div class='flex-1 text-center'>
      <h1 class='text-2xl font-bold text-gray-800'>SiteName</h1>
    </div>
    <nav class='flex-1'>
      <ul class='flex justify-center space-x-6'>
        <li><a href='#' class='text-gray-600 hover:text-blue-600'>Home</a></li>
        <li><a href='#' class='text-gray-600 hover:text-blue-600'>About</a></li>
        <li><a href='#' class='text-gray-600 hover:text-blue-600'>Services</a></li>
        <li><a href='#' class='text-gray-600 hover:text-blue-600'>Contact</a></li>
      </ul>
    </nav>
  </div>
</section>
```

### Example 2: Logo Center with Call to Action

**When To Use**: Ideal for a promotional landing page where you want to highlight a specific action, such as signing up or learning more.

**Why It Works**: The combination of a centered logo and a prominent call-to-action button draws attention and encourages user engagement, while the spacing keeps the layout clean and organized.

**Tailwind Notes**:
- The use of padding and margins creates breathing room around elements, improving readability.
- The button styling with background color and hover effects makes the CTA stand out.
- Flexbox allows for easy alignment and distribution of elements.

```html
<section class='bg-gray-100 py-8 px-4'>
  <div class='container mx-auto flex flex-col items-center'>
    <h1 class='text-3xl font-extrabold text-gray-900 mb-4'>SiteName</h1>
    <p class='text-lg text-gray-700 mb-6 text-center'>Join us today and start your journey!</p>
    <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition'>Get Started</a>
  </div>
</section>
```

### Example 3: Logo Center with Dropdown Navigation

**When To Use**: Use this layout when you have a larger set of navigation links that require organization without overwhelming the user.

**Why It Works**: The dropdown menu keeps the navigation clean while allowing for easy access to additional links, and the centered logo maintains brand visibility.

**Tailwind Notes**:
- Dropdowns are styled with Tailwind to ensure they are visually distinct and accessible.
- Flex utilities help align the logo and dropdowns properly.
- Responsive design ensures that the dropdown behaves well on mobile devices.

```html
<section class='bg-white py-6 px-4'>
  <div class='container mx-auto flex flex-col items-center'>
    <h1 class='text-2xl font-bold text-gray-800 mb-4'>SiteName</h1>
    <nav class='relative'>
      <button class='text-gray-600 hover:text-blue-600 focus:outline-none'>Menu</button>
      <div class='absolute hidden group-hover:block bg-white shadow-lg mt-2 rounded'>
        <ul class='flex flex-col'>
          <li><a href='#' class='block px-4 py-2 text-gray-700 hover:bg-gray-100'>Home</a></li>
          <li><a href='#' class='block px-4 py-2 text-gray-700 hover:bg-gray-100'>About</a></li>
          <li><a href='#' class='block px-4 py-2 text-gray-700 hover:bg-gray-100'>Services</a></li>
          <li><a href='#' class='block px-4 py-2 text-gray-700 hover:bg-gray-100'>Contact</a></li>
        </ul>
      </div>
    </nav>
  </div>
</section>
```

## `split-nav` / `dual-rail`

### Example 1: Product Showcase with Navigation

**When To Use**: When you want to highlight two main product categories with clear navigation links for each.

**Why It Works**: This layout effectively uses visual hierarchy and contrasting colors to draw attention to the products while providing easy navigation. The dual-rail design allows for a clear separation of content and navigation, enhancing user experience.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs background colors for contrast.
- Uses padding and margin utilities for spacing.

```html
<section class='flex flex-col md:flex-row bg-gray-100 p-8'>
  <div class='flex-1 flex flex-col justify-center p-6'>
    <h2 class='text-3xl font-bold text-gray-800'>Explore Our Products</h2>
    <p class='mt-4 text-gray-600'>Find the perfect solution for your needs.</p>
    <ul class='mt-6 space-y-4'>
      <li><a href='#' class='text-blue-600 hover:underline'>Category 1</a></li>
      <li><a href='#' class='text-blue-600 hover:underline'>Category 2</a></li>
    </ul>
  </div>
  <div class='flex-1 bg-white shadow-lg rounded-lg p-6'>
    <h3 class='text-2xl font-semibold text-gray-800'>Featured Products</h3>
    <div class='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div class='border rounded-lg p-4 bg-gray-50'>
        <h4 class='font-bold'>Product 1</h4>
        <p class='text-gray-600'>Description of product 1.</p>
        <button class='mt-2 bg-blue-600 text-white rounded-lg px-4 py-2'>Buy Now</button>
      </div>
      <div class='border rounded-lg p-4 bg-gray-50'>
        <h4 class='font-bold'>Product 2</h4>
        <p class='text-gray-600'>Description of product 2.</p>
        <button class='mt-2 bg-blue-600 text-white rounded-lg px-4 py-2'>Buy Now</button>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Service Offerings with Clear Navigation

**When To Use**: Ideal for service-based businesses looking to showcase different service offerings while providing navigation to learn more.

**Why It Works**: The clear division between navigation and service descriptions allows users to easily understand their options. The use of contrasting colors and clear typography enhances readability and encourages action.

**Tailwind Notes**:
- Employs a responsive flex layout.
- Makes use of color contrast for emphasis.
- Includes ample spacing for clarity.

```html
<section class='flex flex-col md:flex-row bg-white p-8'>
  <nav class='flex-1 bg-blue-50 p-6 rounded-lg shadow-md'>
    <h2 class='text-2xl font-bold text-blue-800'>Our Services</h2>
    <ul class='mt-4 space-y-2'>
      <li><a href='#' class='text-blue-600 hover:underline'>Service A</a></li>
      <li><a href='#' class='text-blue-600 hover:underline'>Service B</a></li>
      <li><a href='#' class='text-blue-600 hover:underline'>Service C</a></li>
    </ul>
  </nav>
  <div class='flex-1 p-6'>
    <h3 class='text-3xl font-semibold text-gray-800'>Why Choose Us?</h3>
    <p class='mt-4 text-gray-600'>We offer tailored solutions to meet your needs.</p>
    <div class='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div class='border rounded-lg p-4 bg-gray-50'>
        <h4 class='font-bold'>Service A</h4>
        <p class='text-gray-600'>Description of Service A.</p>
        <button class='mt-2 bg-blue-600 text-white rounded-lg px-4 py-2'>Learn More</button>
      </div>
      <div class='border rounded-lg p-4 bg-gray-50'>
        <h4 class='font-bold'>Service B</h4>
        <p class='text-gray-600'>Description of Service B.</p>
        <button class='mt-2 bg-blue-600 text-white rounded-lg px-4 py-2'>Learn More</button>
      </div>
    </div>
  </div>
</section>
```

## `side-nav` / `left-rail`

### Example 1: Simple Left-Rail Navigation

**When To Use**: Use this layout for a straightforward navigation system that allows easy access to various sections of a product or service.

**Why It Works**: This design utilizes a clean vertical layout with clear hierarchy and ample spacing, making it easy for users to navigate. The contrasting colors enhance readability and draw attention to the active link.

**Tailwind Notes**:
- Flexbox layout for alignment and spacing.
- Hover effects for interactive feedback.
- Active link highlighting for clarity.

```html
<section class='flex h-screen bg-gray-100'>
  <nav class='w-64 bg-white shadow-lg p-5'>
    <h2 class='text-xl font-bold mb-6'>Menu</h2>
    <ul class='space-y-4'>
      <li><a href='#' class='text-gray-700 hover:text-blue-500 transition-colors'>Home</a></li>
      <li><a href='#' class='text-gray-700 hover:text-blue-500 transition-colors'>About</a></li>
      <li><a href='#' class='text-gray-700 hover:text-blue-500 transition-colors'>Services</a></li>
      <li><a href='#' class='text-gray-700 hover:text-blue-500 transition-colors'>Contact</a></li>
    </ul>
  </nav>
  <main class='flex-1 p-6'>
    <h1 class='text-3xl font-bold'>Welcome to Our Service</h1>
    <p class='mt-4'>Explore our features and offerings.</p>
  </main>
</section>
```

### Example 2: Left-Rail Navigation with Icons

**When To Use**: Ideal for applications or sites where visual cues enhance navigation and user experience.

**Why It Works**: Incorporating icons next to text improves usability and recognition. The layout remains clean, with sufficient spacing between items, ensuring that users can easily scan through the options.

**Tailwind Notes**:
- Use of icons for visual hierarchy.
- Consistent padding for touch targets.
- Responsive adjustments for mobile screens.

```html
<section class='flex h-screen bg-gray-50'>
  <nav class='w-64 bg-white shadow-md p-5'>
    <h2 class='text-xl font-bold mb-6'>Dashboard</h2>
    <ul class='space-y-4'>
      <li class='flex items-center'><img src='home-icon.svg' alt='Home' class='mr-3'><a href='#' class='text-gray-700 hover:text-blue-600 transition-colors'>Home</a></li>
      <li class='flex items-center'><img src='about-icon.svg' alt='About' class='mr-3'><a href='#' class='text-gray-700 hover:text-blue-600 transition-colors'>About Us</a></li>
      <li class='flex items-center'><img src='services-icon.svg' alt='Services' class='mr-3'><a href='#' class='text-gray-700 hover:text-blue-600 transition-colors'>Services</a></li>
      <li class='flex items-center'><img src='contact-icon.svg' alt='Contact' class='mr-3'><a href='#' class='text-gray-700 hover:text-blue-600 transition-colors'>Contact</a></li>
    </ul>
  </nav>
  <main class='flex-1 p-6'>
    <h1 class='text-3xl font-bold'>Welcome to Your Dashboard</h1>
    <p class='mt-4'>Manage your settings and preferences.</p>
  </main>
</section>
```

## `side-nav` / `icon-rail`

### Example 1: Sidebar Navigation with Icons

**When To Use**: Use this layout for applications or landing pages that require quick access to various sections, enhancing user navigation with visual cues.

**Why It Works**: The use of icons alongside text creates a clear visual hierarchy, making navigation intuitive. The consistent spacing and contrasting colors enhance readability and focus on the CTAs.

**Tailwind Notes**:
- Flexbox is used for layout to ensure responsiveness.
- Hover effects on links provide visual feedback.
- Consistent padding and margins improve overall aesthetics.

```html
<aside class='bg-gray-800 text-white w-64 h-screen p-4'>
  <h2 class='text-lg font-semibold mb-4'>Navigation</h2>
  <nav>
    <ul class='space-y-2'>
      <li>
        <a href='#' class='flex items-center p-2 rounded hover:bg-gray-700 transition duration-200'>
          <svg class='w-6 h-6 mr-2' fill='currentColor' viewBox='0 0 20 20'><path d='M10 1a9 9 0 100 18 9 9 0 000-18z'/></svg>
          Dashboard
        </a>
      </li>
      <li>
        <a href='#' class='flex items-center p-2 rounded hover:bg-gray-700 transition duration-200'>
          <svg class='w-6 h-6 mr-2' fill='currentColor' viewBox='0 0 20 20'><path d='M5 3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4a1 1 0 00-1-1H5z'/></svg>
          Reports
        </a>
      </li>
      <li>
        <a href='#' class='flex items-center p-2 rounded hover:bg-gray-700 transition duration-200'>
          <svg class='w-6 h-6 mr-2' fill='currentColor' viewBox='0 0 20 20'><path d='M10 1a9 9 0 100 18 9 9 0 000-18z'/></svg>
          Settings
        </a>
      </li>
    </ul>
  </nav>
</aside>
```

### Example 2: Compact Icon Rail for Mobile

**When To Use**: Ideal for mobile layouts where screen space is limited but navigation needs to remain accessible and user-friendly.

**Why It Works**: The vertical alignment and compact design ensure that users can quickly tap on navigation items without clutter. The icons are large enough for easy interaction, and the background color contrasts well with the icons.

**Tailwind Notes**:
- Utilizes responsive utility classes for mobile-first design.
- Icons are sized appropriately for touch targets.
- Hover and focus states enhance accessibility.

```html
<aside class='bg-gray-900 text-white w-full md:w-16 h-auto md:h-screen p-2 md:p-4 flex md:flex-col justify-center'>
  <nav class='flex md:flex-col'>
    <a href='#' class='flex items-center justify-center p-2 rounded hover:bg-gray-800 transition duration-200'>
      <svg class='w-8 h-8' fill='currentColor' viewBox='0 0 20 20'><path d='M10 1a9 9 0 100 18 9 9 0 000-18z'/></svg>
    </a>
    <a href='#' class='flex items-center justify-center p-2 rounded hover:bg-gray-800 transition duration-200'>
      <svg class='w-8 h-8' fill='currentColor' viewBox='0 0 20 20'><path d='M5 3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4a1 1 0 00-1-1H5z'/></svg>
    </a>
    <a href='#' class='flex items-center justify-center p-2 rounded hover:bg-gray-800 transition duration-200'>
      <svg class='w-8 h-8' fill='currentColor' viewBox='0 0 20 20'><path d='M10 1a9 9 0 100 18 9 9 0 000-18z'/></svg>
    </a>
  </nav>
</aside>
```

## `side-nav` / `section-jump`

### Example 1: Simple Vertical Navigation

**When To Use**: When you need a straightforward side navigation for quick access to different sections of a landing page.

**Why It Works**: The use of a clean layout with clear typography and spacing enhances readability and user experience. The hover effects on links provide visual feedback, making navigation intuitive.

**Tailwind Notes**:
- Uses flex for vertical alignment.
- Consistent spacing with padding and margin for clarity.
- Hover effects improve interactivity.

```html
<section class='bg-gray-100 p-6 w-64 h-screen shadow-lg'>
  <h2 class='text-xl font-semibold mb-4'>Quick Links</h2>
  <nav class='flex flex-col'>
    <a href='#section1' class='text-gray-700 hover:text-blue-600 py-2'>Section 1</a>
    <a href='#section2' class='text-gray-700 hover:text-blue-600 py-2'>Section 2</a>
    <a href='#section3' class='text-gray-700 hover:text-blue-600 py-2'>Section 3</a>
    <a href='#section4' class='text-gray-700 hover:text-blue-600 py-2'>Section 4</a>
  </nav>
</section>
```

### Example 2: Highlighted Navigation with CTA

**When To Use**: When you want to emphasize a call-to-action alongside navigation links, suitable for marketing sites.

**Why It Works**: The CTA button is visually distinct with contrasting colors, drawing attention. The layout is clean, and the use of rounded corners softens the design, making it approachable.

**Tailwind Notes**:
- Utilizes a contrasting background for the CTA.
- Rounded corners on buttons enhance visual appeal.
- Flexbox for responsive behavior.

```html
<section class='bg-white p-6 w-64 h-screen shadow-md'>
  <h2 class='text-2xl font-bold mb-4'>Explore Sections</h2>
  <nav class='flex flex-col mb-4'>
    <a href='#about' class='text-gray-800 hover:text-blue-600 py-2'>About Us</a>
    <a href='#services' class='text-gray-800 hover:text-blue-600 py-2'>Our Services</a>
    <a href='#portfolio' class='text-gray-800 hover:text-blue-600 py-2'>Portfolio</a>
    <a href='#contact' class='text-gray-800 hover:text-blue-600 py-2'>Contact</a>
  </nav>
  <a href='#get-started' class='bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700'>Get Started</a>
</section>
```

### Example 3: Collapsible Side Navigation

**When To Use**: When space is limited, and you want to provide expandable navigation options for a more compact layout.

**Why It Works**: The collapsible feature saves space while maintaining accessibility. Clear icons and labels enhance usability, and the transition effects provide a smooth interaction experience.

**Tailwind Notes**:
- Transition classes for smooth opening/closing.
- Icons improve recognition of navigation items.
- Flexbox for alignment and structure.

```html
<section class='bg-gray-200 p-4 w-64 h-screen shadow-lg'>
  <h2 class='text-lg font-semibold mb-2'>Navigation</h2>
  <div class='flex flex-col'>
    <button class='flex items-center text-left text-gray-700 py-2 hover:text-blue-600' onclick='toggleMenu()'>
      <span class='material-icons mr-2'>expand_more</span>Menu
    </button>
    <div class='hidden transition-all duration-300 ease-in-out' id='submenu'>
      <a href='#item1' class='block text-gray-600 hover:text-blue-500 py-1'>Item 1</a>
      <a href='#item2' class='block text-gray-600 hover:text-blue-500 py-1'>Item 2</a>
      <a href='#item3' class='block text-gray-600 hover:text-blue-500 py-1'>Item 3</a>
    </div>
  </div>
</section>
```

## `hero` / `centered`

### Example 1: Minimalist Hero Section

**When To Use**: Use this design for a clean and modern landing page that focuses on a single product or service.

**Why It Works**: The use of ample white space and a bold heading creates a strong focal point, while the contrasting colors enhance readability and draw attention to the CTA.

**Tailwind Notes**:
- Utilizes flexbox for vertical centering.
- Responsive typography ensures readability across devices.
- Strong contrast between background and text for accessibility.

```html
<section class='flex items-center justify-center h-screen bg-gray-900 text-white text-center px-4'>
  <div>
    <h1 class='text-5xl font-bold mb-4'>Transform Your Business</h1>
    <p class='text-xl mb-8'>Unlock the potential of your company with our innovative solutions.</p>
    <a href='#' class='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300'>Get Started</a>
  </div>
</section>
```

### Example 2: Bold Imagery Hero Section

**When To Use**: Ideal for brands that want to showcase their products with impactful visuals while maintaining a strong message.

**Why It Works**: The background image adds depth and context, while the overlay ensures text remains legible. The CTA button is prominently displayed to encourage user interaction.

**Tailwind Notes**:
- Background image with overlay for readability.
- Large text sizes for emphasis on key messages.
- Button styling encourages clicks with hover effects.

```html
<section class='relative flex items-center justify-center h-screen bg-cover bg-center' style='background-image: url(https://example.com/hero-image.jpg)'>
  <div class='absolute inset-0 bg-black opacity-50'></div>
  <div class='relative text-white text-center px-4'>
    <h1 class='text-6xl font-extrabold mb-4'>Your Journey Begins Here</h1>
    <p class='text-lg mb-8'>Join us to explore the world of possibilities.</p>
    <a href='#' class='bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300'>Learn More</a>
  </div>
</section>
```

### Example 3: Split Hero Section with Call to Action

**When To Use**: Best for services that require a brief explanation alongside a strong call to action, appealing to both visual and textual learners.

**Why It Works**: The split layout allows for a visual representation of the service while clearly communicating the value proposition. The CTA is distinct and easy to find.

**Tailwind Notes**:
- Flexbox layout provides a responsive design.
- Clear separation of text and imagery aids comprehension.
- Consistent padding and margins create a balanced layout.

```html
<section class='flex flex-col md:flex-row items-center justify-between h-screen bg-white px-8'>
  <div class='md:w-1/2 mb-8 md:mb-0'>
    <h1 class='text-5xl font-bold mb-4'>Empower Your Team</h1>
    <p class='text-lg mb-8'>Our tools help you collaborate effectively and achieve more.</p>
    <a href='#' class='bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300'>Get Started</a>
  </div>
  <div class='md:w-1/2'>
    <img src='https://example.com/image.jpg' alt='Team Collaboration' class='w-full h-auto rounded-lg shadow-lg'>
  </div>
</section>
```

## `hero` / `split-image`

### Example 1: Hero Section with Left Image and Right Text

**When To Use**: When you want to draw attention to a product or service with a compelling image and a strong call to action.

**Why It Works**: The split layout creates a clear visual hierarchy that leads the viewer's eye from the image to the text, enhancing engagement. The use of contrasting colors ensures readability and emphasis on the CTA.

**Tailwind Notes**:
- Flexbox for easy alignment and responsiveness.
- Utilizes padding and margin for spacing consistency.
- Text colors and backgrounds provide strong contrast.

```html
<section class='flex flex-col md:flex-row items-center justify-between p-8 bg-gray-100'>
  <div class='md:w-1/2 mb-6 md:mb-0'>
    <img src='path/to/image.jpg' alt='Descriptive Alt Text' class='w-full h-auto rounded-lg shadow-lg' />
  </div>
  <div class='md:w-1/2 md:pl-8'>
    <h1 class='text-4xl font-bold text-gray-800 mb-2'>Transform Your Business</h1>
    <p class='text-lg text-gray-600 mb-6'>Discover the tools you need to succeed in the digital age.</p>
    <a href='#' class='inline-block bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition'>Get Started</a>
  </div>
</section>
```

### Example 2: Hero Section with Right Image and Left Text

**When To Use**: Ideal for scenarios where the image represents a service or product that complements the text on the left.

**Why It Works**: This layout variation keeps the viewer's attention balanced while allowing the image to support the message visually. The CTA is prominent and encourages interaction.

**Tailwind Notes**:
- Responsive utility classes ensure the layout adapts on different screen sizes.
- Proper use of whitespace enhances readability and visual appeal.
- Hover effects on the CTA improve user experience.

```html
<section class='flex flex-col md:flex-row-reverse items-center justify-between p-8 bg-white'>
  <div class='md:w-1/2 mb-6 md:mb-0'>
    <h1 class='text-4xl font-bold text-gray-900 mb-2'>Elevate Your Experience</h1>
    <p class='text-lg text-gray-700 mb-6'>Join us to unlock premium features and benefits.</p>
    <a href='#' class='inline-block bg-green-500 text-white py-3 px-6 rounded-lg shadow hover:bg-green-600 transition'>Learn More</a>
  </div>
  <div class='md:w-1/2 md:pr-8'>
    <img src='path/to/image.jpg' alt='Descriptive Alt Text' class='w-full h-auto rounded-lg shadow-lg' />
  </div>
</section>
```

### Example 3: Hero Section with Background Image and Overlay Text

**When To Use**: Perfect for creating an immersive experience where the background image sets the mood and the text conveys the message prominently.

**Why It Works**: The background image creates an engaging visual context, while the overlay ensures that the text remains legible. This approach is effective for storytelling and brand identity.

**Tailwind Notes**:
- Background utilities for full-width image coverage.
- Text shadow improves contrast against complex backgrounds.
- Flex utilities for vertical and horizontal centering.

```html
<section class='relative w-full h-screen bg-cover bg-center' style='background-image: url(path/to/background.jpg);'>
  <div class='absolute inset-0 bg-black opacity-50'></div>
  <div class='relative flex items-center justify-center h-full text-center text-white p-4'>
    <div>
      <h1 class='text-5xl font-bold mb-4'>Your Journey Begins Here</h1>
      <p class='text-xl mb-6'>Explore the world of possibilities with us.</p>
      <a href='#' class='inline-block bg-red-600 text-white py-3 px-6 rounded-lg shadow hover:bg-red-700 transition'>Start Now</a>
    </div>
  </div>
</section>
```

## `hero` / `background-image`

### Example 1: Hero Section with Bold Call to Action

**When To Use**: Use this layout to immediately capture user attention and drive action, perfect for product launches or special promotions.

**Why It Works**: The large background image creates an immersive experience, while the contrasting text and CTA button ensure clarity and focus on the desired action.

**Tailwind Notes**:
- Utilizes a full-height background image for visual impact.
- Text is centered for a balanced composition.
- High contrast between text and background enhances readability.

```html
<section class='relative bg-cover bg-center h-screen' style='background-image: url(https://example.com/hero-bg.jpg);'><div class='absolute inset-0 bg-black opacity-50'></div><div class='relative flex flex-col items-center justify-center h-full text-white text-center p-6'><h1 class='text-5xl font-bold mb-4'>Transform Your Business</h1><p class='text-lg mb-8'>Join thousands of satisfied customers and elevate your brand.</p><a href='#' class='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300'>Get Started</a></div></section>
```

### Example 2: Hero Section with Overlay and Subtle Details

**When To Use**: Ideal for showcasing a service or feature with a focus on storytelling and user engagement.

**Why It Works**: The overlay softens the background image, making the text more legible while maintaining visual interest. The subtle details in typography add sophistication.

**Tailwind Notes**:
- Includes a semi-transparent overlay for better text visibility.
- Utilizes responsive typography to ensure readability across devices.
- The button is styled for emphasis and includes hover effects for interactivity.

```html
<section class='relative bg-cover bg-center h-screen' style='background-image: url(https://example.com/hero-bg-2.jpg);'><div class='absolute inset-0 bg-gray-800 opacity-60'></div><div class='relative flex flex-col items-center justify-center h-full text-white text-center p-8'><h1 class='text-6xl font-extrabold mb-4'>Your Journey Begins Here</h1><p class='text-xl mb-6'>Discover the tools that will take your business to the next level.</p><a href='#' class='bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300'>Learn More</a></div></section>
```

### Example 3: Hero Section with Split Content Layout

**When To Use**: Best for highlighting multiple aspects of a service or product, allowing for a clean and organized presentation.

**Why It Works**: The split layout provides a clear visual hierarchy, directing attention to both the image and the text. The use of cards for additional information maintains a cohesive design.

**Tailwind Notes**:
- Employs a split layout for effective content distribution.
- Cards are used to present additional features or benefits clearly.
- Responsive design ensures accessibility on various screen sizes.

```html
<section class='flex flex-col md:flex-row items-center h-screen bg-cover' style='background-image: url(https://example.com/hero-bg-3.jpg);'><div class='flex-1 p-8 text-white'><h1 class='text-4xl font-bold mb-4'>Elevate Your Skills</h1><p class='text-lg mb-6'>Join our community of learners and experts.</p><a href='#' class='bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300'>Sign Up Now</a></div><div class='flex-1 p-8'><div class='grid grid-cols-1 md:grid-cols-2 gap-4'><div class='bg-white p-4 rounded-lg shadow-md'><h2 class='text-lg font-bold'>Feature 1</h2><p class='text-gray-700'>Description of feature 1.</p></div><div class='bg-white p-4 rounded-lg shadow-md'><h2 class='text-lg font-bold'>Feature 2</h2><p class='text-gray-700'>Description of feature 2.</p></div><div class='bg-white p-4 rounded-lg shadow-md'><h2 class='text-lg font-bold'>Feature 3</h2><p class='text-gray-700'>Description of feature 3.</p></div><div class='bg-white p-4 rounded-lg shadow-md'><h2 class='text-lg font-bold'>Feature 4</h2><p class='text-gray-700'>Description of feature 4.</p></div></div></div></section>
```

## `hero` / `video`

### Example 1: Engaging Video Hero with Call to Action

**When To Use**: Use this example for a landing page that aims to showcase a product or service with an engaging video background and a strong call to action.

**Why It Works**: The large video background captures attention immediately, while the centered text and prominent CTA button guide users toward the desired action. The use of contrasting colors ensures readability.

**Tailwind Notes**:
- Flexbox utilities for centering content.
- Responsive typography for different screen sizes.
- Background video for engagement without overwhelming the content.

```html
<section class='relative flex items-center justify-center h-screen overflow-hidden bg-black'>
  <video class='absolute top-0 left-0 w-full h-full object-cover' autoplay muted loop>
    <source src='video.mp4' type='video/mp4'>
    Your browser does not support the video tag.
  </video>
  <div class='relative z-10 text-center text-white p-8'>
    <h1 class='text-5xl md:text-6xl font-bold mb-4'>Transform Your Business</h1>
    <p class='text-lg md:text-xl mb-8'>Unlock the potential of your company with our innovative solutions.</p>
    <a href='#' class='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300'>Get Started</a>
  </div>
</section>
```

### Example 2: Informative Video Hero with Overlay

**When To Use**: Ideal for educational platforms or services that want to highlight a tutorial or informative video with a clear message and action.

**Why It Works**: The overlay provides contrast for the text, ensuring it remains legible against the video background. The structured layout emphasizes the heading and subheading, while the CTA stands out with a contrasting color.

**Tailwind Notes**:
- Overlay for improved text contrast.
- Clear hierarchy with larger headings and smaller subheadings.
- Responsive design that adapts to various screen sizes.

```html
<section class='relative flex items-center justify-center h-screen bg-black'>
  <video class='absolute top-0 left-0 w-full h-full object-cover' autoplay muted loop>
    <source src='video.mp4' type='video/mp4'>
    Your browser does not support the video tag.
  </video>
  <div class='absolute inset-0 bg-black opacity-50'></div>
  <div class='relative z-10 text-center text-white p-8'>
    <h1 class='text-4xl md:text-5xl font-bold mb-2'>Learn from the Best</h1>
    <p class='text-lg md:text-xl mb-6'>Join our community and access exclusive content.</p>
    <a href='#' class='bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300'>Join Now</a>
  </div>
</section>
```

## `hero` / `offer-focused`

### Example 1: Bold Offer with Call to Action

**When To Use**: Use this layout when you want to highlight a specific offer prominently with a strong call to action.

**Why It Works**: The large heading grabs attention, while the contrasting button encourages immediate action. The background gradient adds depth, making the offer stand out.

**Tailwind Notes**:
- Use of responsive typography for accessibility.
- Contrast between text and background for readability.
- Padding and margin create a spacious feel.

```html
<section class='bg-gradient-to-r from-blue-500 to-teal-500 text-white py-20 px-6 text-center'>
  <h1 class='text-4xl md:text-5xl font-bold mb-4'>Unlock Exclusive Savings!</h1>
  <p class='text-lg md:text-xl mb-6'>Join us today and get 20% off your first purchase.</p>
  <a href='#' class='bg-white text-blue-500 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300'>Get Started</a>
</section>
```

### Example 2: Minimalist Offer Display with Image

**When To Use**: Ideal for showcasing a product or service alongside a compelling offer, especially when visuals are important.

**Why It Works**: The layout balances text and imagery, maintaining focus on the offer while providing visual interest. The responsive design ensures it looks good on all devices.

**Tailwind Notes**:
- Flexbox for responsive alignment.
- Image and text spacing enhances clarity.
- Subtle hover effects on buttons for interactivity.

```html
<section class='flex flex-col md:flex-row items-center justify-between bg-white p-10 md:p-20'>
  <div class='md:w-1/2 mb-6 md:mb-0'>
    <h1 class='text-3xl font-bold mb-4'>Limited Time Offer: 30% Off!</h1>
    <p class='text-gray-700 mb-6'>Don't miss out on our best deals of the season. Shop now and save!</p>
    <a href='#' class='bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300'>Shop Now</a>
  </div>
  <div class='md:w-1/2'>
    <img src='offer-image.jpg' alt='Exclusive Offer' class='rounded-lg shadow-lg' />
  </div>
</section>
```

### Example 3: Split Offer Section with Testimonials

**When To Use**: Best for building trust while promoting an offer, using testimonials to enhance credibility.

**Why It Works**: The split layout allows for a clear presentation of the offer and supporting testimonials, with ample spacing that keeps the design clean. The contrasting background helps the offer pop.

**Tailwind Notes**:
- Grid layout for structured content display.
- Testimonial cards provide visual separation.
- Consistent padding enhances readability.

```html
<section class='bg-gray-100 py-20 px-6'>
  <div class='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10'>
    <div class='bg-white p-8 rounded-lg shadow-lg'>
      <h1 class='text-4xl font-bold mb-4'>Special Offer: Buy One Get One Free!</h1>
      <p class='text-lg mb-6'>Grab this chance to double your savings. Limited time only!</p>
      <a href='#' class='bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300'>Claim Offer</a>
    </div>
    <div class='space-y-4'>
      <h2 class='text-2xl font-semibold mb-4'>What Our Customers Say</h2>
      <div class='bg-white p-4 rounded-lg shadow-md'>
        <p class='text-gray-600'>“This offer changed my life! Highly recommend!” - Jane D.</p>
      </div>
      <div class='bg-white p-4 rounded-lg shadow-md'>
        <p class='text-gray-600'>“Incredible value for money. I’m a loyal customer now!” - John S.</p>
      </div>
    </div>
  </div>
</section>
```

## `hero` / `lead-form`

### Example 1: Simple Hero with Lead Form

**When To Use**: Use this layout for straightforward lead capture with a strong emphasis on the call-to-action.

**Why It Works**: The combination of a bold heading, a clear subheading, and a prominent form encourages user engagement. The use of contrasting colors and ample spacing enhances readability and visual appeal.

**Tailwind Notes**:
- Utilizes flexbox for responsive alignment.
- Employs background color and shadow for depth.
- Responsive typography for better readability on all devices.

```html
<section class='flex flex-col items-center justify-center bg-blue-600 text-white py-20 px-4 text-center'>
  <h1 class='text-4xl md:text-5xl font-bold mb-4'>Join Our Community</h1>
  <p class='text-lg md:text-xl mb-8'>Sign up to receive the latest updates and exclusive offers.</p>
  <form class='w-full max-w-md'>
    <input type='email' placeholder='Your email address' class='w-full p-3 mb-4 text-gray-800 placeholder-gray-500 rounded-lg shadow-md' required />
    <button type='submit' class='w-full bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200'>Get Started</button>
  </form>
</section>
```

### Example 2: Hero with Image and Lead Form

**When To Use**: Ideal for visually-driven campaigns where imagery complements the message and form.

**Why It Works**: The combination of an engaging image and a clear lead form creates a compelling visual narrative. The layout maintains a clean structure, ensuring that the form remains the focal point.

**Tailwind Notes**:
- Uses a background image with an overlay for contrast.
- Employs grid layout for responsive design.
- Includes rounded corners and shadows for a polished look.

```html
<section class='relative bg-cover bg-center h-screen' style='background-image: url(https://via.placeholder.com/1200);'>
  <div class='absolute inset-0 bg-black opacity-50'></div>
  <div class='relative flex flex-col items-center justify-center h-full text-white text-center p-4'>
    <h1 class='text-4xl md:text-5xl font-bold mb-4'>Transform Your Business</h1>
    <p class='text-lg md:text-xl mb-8'>Unlock your potential with our services.</p>
    <form class='w-full max-w-md'>
      <input type='email' placeholder='Enter your email' class='w-full p-3 mb-4 text-gray-800 placeholder-gray-500 rounded-lg shadow-md' required />
      <button type='submit' class='w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200'>Join Now</button>
    </form>
  </div>
</section>
```

### Example 3: Split Hero with Lead Form and Features

**When To Use**: Best for showcasing features alongside a lead capture form in a balanced layout.

**Why It Works**: This layout effectively divides attention between the lead form and key features, making it easy for users to understand the value proposition. The use of cards for features adds visual interest without overwhelming the main CTA.

**Tailwind Notes**:
- Employs a grid layout for structured content display.
- Utilizes card components for features with consistent spacing.
- Responsive design ensures usability across devices.

```html
<section class='bg-gray-100 py-20 px-4'>
  <div class='container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
    <div class='flex flex-col justify-center'>
      <h1 class='text-4xl font-bold mb-4'>Get Started Today</h1>
      <p class='text-lg mb-8'>Join us and explore the benefits.</p>
      <form class='w-full max-w-md'>
        <input type='email' placeholder='Your email address' class='w-full p-3 mb-4 text-gray-800 placeholder-gray-500 rounded-lg shadow-md' required />
        <button type='submit' class='w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200'>Sign Up</button>
      </form>
    </div>
    <div class='grid grid-cols-1 gap-4'>
      <div class='bg-white p-6 rounded-lg shadow-md'>
        <h2 class='text-xl font-semibold'>Feature One</h2>
        <p class='text-gray-600'>Description of feature one that adds value.</p>
      </div>
      <div class='bg-white p-6 rounded-lg shadow-md'>
        <h2 class='text-xl font-semibold'>Feature Two</h2>
        <p class='text-gray-600'>Description of feature two that enhances experience.</p>
      </div>
      <div class='bg-white p-6 rounded-lg shadow-md'>
        <h2 class='text-xl font-semibold'>Feature Three</h2>
        <p class='text-gray-600'>Description of feature three that attracts users.</p>
      </div>
    </div>
  </div>
</section>
```

## `hero` / `booking`

### Example 1: Simple Booking Hero

**When To Use**: Use this layout for a straightforward booking experience, ideal for services like hotels or flights.

**Why It Works**: The large heading grabs attention, while the subheading provides context. The prominent CTA button encourages immediate action, and the background image creates visual interest.

**Tailwind Notes**:
- Utilizes flexbox for vertical centering.
- Responsive typography scales well on mobile devices.
- High contrast between text and background enhances readability.

```html
<section class="relative flex items-center justify-center h-screen bg-cover bg-center" style="background-image: url('path/to/image.jpg');">
  <div class="bg-white bg-opacity-80 p-10 rounded-lg shadow-lg text-center">
    <h1 class="text-4xl font-bold text-gray-800 mb-4">Book Your Dream Vacation</h1>
    <p class="text-lg text-gray-600 mb-8">Find the best deals on hotels and flights.</p>
    <a href="#" class="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200">Get Started</a>
  </div>
</section>
```

### Example 2: Booking Hero with Featured Offers

**When To Use**: Ideal for showcasing multiple booking options or featured offers, suitable for travel agencies or event bookings.

**Why It Works**: The grid layout allows for a clear presentation of multiple offers, while the prominent CTA ensures that users can easily engage. The use of cards adds depth and visual separation.

**Tailwind Notes**:
- Grid layout ensures responsiveness and adaptability across devices.
- Card components provide visual hierarchy and organization.
- Hover effects on cards enhance user interaction.

```html
<section class="py-20 bg-gray-100">
  <div class="container mx-auto text-center mb-12">
    <h1 class="text-5xl font-bold text-gray-800 mb-4">Book Your Next Adventure</h1>
    <p class="text-lg text-gray-600">Choose from our featured offers below.</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <img src="path/to/offer1.jpg" alt="Offer 1" class="w-full h-48 object-cover">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-800">Beach Getaway</h2>
        <p class="text-gray-600">Enjoy a relaxing stay at our beach resort.</p>
        <a href="#" class="mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded">Book Now</a>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <img src="path/to/offer2.jpg" alt="Offer 2" class="w-full h-48 object-cover">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-800">Mountain Retreat</h2>
        <p class="text-gray-600">Experience the beauty of the mountains.</p>
        <a href="#" class="mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded">Book Now</a>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <img src="path/to/offer3.jpg" alt="Offer 3" class="w-full h-48 object-cover">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-800">City Escape</h2>
        <p class="text-gray-600">Discover the vibrant life of the city.</p>
        <a href="#" class="mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded">Book Now</a>
      </div>
    </div>
  </div>
</section>
```

## `hero` / `comparison`

### Example 1: Product Comparison Hero

**When To Use**: Use this layout to highlight the differences between two products or services, encouraging users to choose one over the other.

**Why It Works**: The clear visual distinction between the two products, combined with strong typography and emphasis on CTAs, guides users towards a decision. The use of contrasting colors for the buttons enhances visibility and encourages action.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Emphasizes CTAs with contrasting colors.
- Maintains ample whitespace for clarity.

```html
<section class='bg-gray-100 py-16 px-4 text-center'><div class='max-w-7xl mx-auto'><h1 class='text-4xl font-bold text-gray-800 mb-4'>Compare Our Products</h1><p class='text-lg text-gray-600 mb-8'>Find the perfect fit for your needs.</p><div class='flex flex-col md:flex-row justify-center space-x-4'><div class='bg-white shadow-lg rounded-lg p-6 flex-1'><h2 class='text-2xl font-semibold text-gray-800'>Product A</h2><p class='text-gray-600 mb-4'>Feature-rich and user-friendly.</p><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Choose Product A</a></div><div class='bg-white shadow-lg rounded-lg p-6 flex-1'><h2 class='text-2xl font-semibold text-gray-800'>Product B</h2><p class='text-gray-600 mb-4'>Affordable and efficient.</p><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Choose Product B</a></div></div></div></section>
```

### Example 2: Service Comparison Hero

**When To Use**: Ideal for service-based businesses wanting to showcase different service tiers or packages.

**Why It Works**: The tiered approach with clear headings and benefits helps users quickly identify which service meets their needs. The use of icons adds visual interest and assists in conveying information quickly.

**Tailwind Notes**:
- Uses grid layout for organized presentation.
- Incorporates icons to enhance understanding.
- Responsive design ensures usability across devices.

```html
<section class='bg-white py-16 px-4'><div class='max-w-6xl mx-auto text-center'><h1 class='text-4xl font-bold text-gray-900 mb-4'>Choose Your Plan</h1><p class='text-lg text-gray-700 mb-8'>Select the plan that suits your business best.</p><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='border border-gray-300 rounded-lg p-6'><h2 class='text-2xl font-semibold text-gray-800 mb-2'>Basic Plan</h2><p class='text-gray-600 mb-4'>Ideal for startups.</p><ul class='text-left text-gray-600 mb-4'><li class='mb-2'>✔ Feature 1</li><li class='mb-2'>✔ Feature 2</li><li class='mb-2'>✔ Feature 3</li></ul><a href='#' class='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700'>Get Started</a></div><div class='border border-gray-300 rounded-lg p-6'><h2 class='text-2xl font-semibold text-gray-800 mb-2'>Pro Plan</h2><p class='text-gray-600 mb-4'>Perfect for growing businesses.</p><ul class='text-left text-gray-600 mb-4'><li class='mb-2'>✔ Feature 1</li><li class='mb-2'>✔ Feature 2</li><li class='mb-2'>✔ Feature 3</li></ul><a href='#' class='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700'>Get Started</a></div><div class='border border-gray-300 rounded-lg p-6'><h2 class='text-2xl font-semibold text-gray-800 mb-2'>Enterprise Plan</h2><p class='text-gray-600 mb-4'>For large organizations.</p><ul class='text-left text-gray-600 mb-4'><li class='mb-2'>✔ Feature 1</li><li class='mb-2'>✔ Feature 2</li><li class='mb-2'>✔ Feature 3</li></ul><a href='#' class='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700'>Get Started</a></div></div></div></section>
```

## `hero` / `manifesto`

### Example 1: Bold Vision Statement

**When To Use**: Use this example to present a strong vision or mission statement that captures attention immediately.

**Why It Works**: The large heading and contrasting colors draw attention, while the clear subheading provides context. The prominent CTA button encourages user engagement, and the background image adds visual interest without overwhelming the text.

**Tailwind Notes**:
- Uses a full-screen height to create an immersive experience.
- High contrast between text and background ensures readability.
- Responsive design adapts well on mobile and desktop.

```html
<section class='flex items-center justify-center h-screen bg-cover bg-center text-white' style='background-image: url(/path/to/image.jpg);'>
  <div class='text-center px-4 md:px-8'>
    <h1 class='text-5xl md:text-6xl font-bold mb-4'>Our Vision for a Better Tomorrow</h1>
    <p class='text-xl md:text-2xl mb-8'>Join us in making a difference today.</p>
    <a href='#' class='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200'>Get Involved</a>
  </div>
</section>
```

### Example 2: Inspirational Call to Action

**When To Use**: Ideal for motivating users to take action, this example emphasizes the importance of community involvement.

**Why It Works**: The use of a gradient background creates a modern feel, while the typography hierarchy is clear. The CTA button is visually distinct, encouraging users to engage immediately. The layout is responsive, ensuring it looks good on all devices.

**Tailwind Notes**:
- Gradient backgrounds add depth and visual appeal.
- Clear hierarchy in typography enhances focus on key messages.
- CTA button is large and inviting, with hover effects for interactivity.

```html
<section class='flex items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
  <div class='text-center px-6 md:px-12'>
    <h1 class='text-6xl font-extrabold mb-4'>Empower Your Community</h1>
    <p class='text-lg md:text-xl mb-6'>Together, we can achieve greatness.</p>
    <a href='#' class='bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-4 px-8 rounded-lg shadow-lg transition duration-300'>Join Us Now</a>
  </div>
</section>
```

### Example 3: Mission-Driven Introduction

**When To Use**: This example is perfect for introducing your mission and inviting users to learn more about your initiatives.

**Why It Works**: The section uses a clean layout with ample white space for a polished look. The typography is well-structured, and the CTA is clearly defined. The background color creates a calm atmosphere, making the text easy to read.

**Tailwind Notes**:
- Ample white space enhances readability and focus.
- Consistent color scheme reinforces brand identity.
- Responsive text sizes ensure accessibility on all devices.

```html
<section class='flex items-center justify-center h-screen bg-gray-100 text-gray-800'>
  <div class='text-center px-4 md:px-8'>
    <h1 class='text-5xl font-bold mb-4'>Our Mission</h1>
    <p class='text-lg md:text-xl mb-8'>To inspire and empower individuals to create positive change.</p>
    <a href='#' class='bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200'>Learn More</a>
  </div>
</section>
```

## `hero` / `editorial`

### Example 1: Hero Section with Bold Call-to-Action

**When To Use**: Use this layout for a landing page that needs to capture attention immediately with a strong call-to-action.

**Why It Works**: The large heading and subheading create a clear hierarchy, while the contrasting colors ensure readability. The prominent CTA button is designed to stand out, encouraging user interaction.

**Tailwind Notes**:
- Utilizes responsive typography to ensure legibility across devices.
- The background gradient creates visual interest without overwhelming the text.

```html
<section class='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center p-6'>
  <h1 class='text-5xl md:text-6xl font-bold leading-tight'>Transform Your Ideas into Reality</h1>
  <p class='mt-4 text-lg md:text-xl'>Join us on a journey to innovate and inspire.</p>
  <a href='#' class='mt-6 px-8 py-3 bg-yellow-400 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition duration-300'>Get Started</a>
</section>
```

### Example 2: Editorial Hero with Image and Text Overlay

**When To Use**: Ideal for showcasing a product or service with a strong visual element that complements the text.

**Why It Works**: The image serves as a backdrop that enhances the message without distracting from it. The overlay text remains readable due to contrasting colors and careful positioning.

**Tailwind Notes**:
- Flexbox is used for centering content, ensuring a polished look.
- The use of absolute positioning for the overlay text allows for creative layouts.

```html
<section class='relative flex items-center justify-center h-screen bg-cover bg-center' style='background-image: url(https://example.com/hero-image.jpg);'>
  <div class='absolute inset-0 bg-black opacity-50'></div>
  <div class='relative z-10 text-white text-center p-6'>
    <h1 class='text-5xl md:text-6xl font-bold'>Your Vision, Our Mission</h1>
    <p class='mt-4 text-lg md:text-xl'>We bring your ideas to life with precision and creativity.</p>
    <a href='#' class='mt-6 px-8 py-3 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg shadow-lg transition duration-300'>Learn More</a>
  </div>
</section>
```

### Example 3: Split Hero Section with Dual Focus

**When To Use**: Use this layout when you want to highlight two key messages or actions side by side.

**Why It Works**: The split design allows for clear differentiation between two messages while maintaining a cohesive look. The use of contrasting backgrounds ensures that each side stands out.

**Tailwind Notes**:
- Flexbox layout ensures responsive behavior, adapting well to various screen sizes.
- Padding and margin are used effectively to create breathing space around text and buttons.

```html
<section class='flex flex-col md:flex-row items-center justify-between h-screen p-6 bg-gray-100'>
  <div class='flex-1 p-8 bg-white shadow-lg rounded-lg m-4'>
    <h1 class='text-4xl font-bold'>Explore New Horizons</h1>
    <p class='mt-2 text-lg'>Discover the possibilities that await you.</p>
    <a href='#' class='mt-4 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg'>Get Started</a>
  </div>
  <div class='flex-1 p-8 bg-white shadow-lg rounded-lg m-4'>
    <h1 class='text-4xl font-bold'>Join Our Community</h1>
    <p class='mt-2 text-lg'>Connect with like-minded individuals.</p>
    <a href='#' class='mt-4 inline-block px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg'>Join Now</a>
  </div>
</section>
```

## `trust-bar` / `simple`

### Example 1: Trust Badges with Descriptive Text

**When To Use**: Use this layout to build credibility on a landing page by showcasing trust badges alongside brief descriptions.

**Why It Works**: The combination of icons and text creates a clear and visually appealing hierarchy, making it easy for users to quickly understand the value propositions. The use of contrasting colors for the badges ensures they stand out.

**Tailwind Notes**:
- Flexbox is used for alignment and spacing, ensuring responsiveness.
- Consistent padding and margin create a clean layout.
- Text colors and sizes are chosen for readability and emphasis.

```html
<section class='bg-white p-6 md:p-10 shadow-lg rounded-lg'><div class='flex flex-wrap justify-center space-x-8'><div class='flex flex-col items-center'><img src='trust-badge1.png' alt='Trust Badge 1' class='w-16 h-16 mb-2'><p class='text-gray-700 text-center'>Secure Payments</p></div><div class='flex flex-col items-center'><img src='trust-badge2.png' alt='Trust Badge 2' class='w-16 h-16 mb-2'><p class='text-gray-700 text-center'>30-Day Guarantee</p></div><div class='flex flex-col items-center'><img src='trust-badge3.png' alt='Trust Badge 3' class='w-16 h-16 mb-2'><p class='text-gray-700 text-center'>Customer Support</p></div></div></section>
```

### Example 2: Customer Testimonials with Trust Indicators

**When To Use**: This layout is ideal for displaying customer testimonials alongside trust indicators to build confidence in your product or service.

**Why It Works**: The testimonials are presented in a card format, which gives each one its own space, enhancing readability. The use of shadows and rounded corners adds a polished feel, while the trust indicators reinforce credibility.

**Tailwind Notes**:
- Grid layout ensures responsiveness across devices.
- Subtle shadows and rounded corners provide a modern aesthetic.
- The use of typography emphasizes the testimonials and trust indicators.

```html
<section class='bg-gray-50 p-8'><div class='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white p-5 rounded-lg shadow-md'><p class='text-lg font-semibold text-gray-800'>“Amazing service! Highly recommend.”</p><p class='text-gray-600 mt-2'>- Jane Doe</p><div class='flex justify-center mt-4'><img src='trust-badge1.png' alt='Trust Badge' class='w-10 h-10'><img src='trust-badge2.png' alt='Trust Badge' class='w-10 h-10 ml-2'></div></div><div class='bg-white p-5 rounded-lg shadow-md'><p class='text-lg font-semibold text-gray-800'>“Best purchase I've made this year!”</p><p class='text-gray-600 mt-2'>- John Smith</p><div class='flex justify-center mt-4'><img src='trust-badge1.png' alt='Trust Badge' class='w-10 h-10'><img src='trust-badge2.png' alt='Trust Badge' class='w-10 h-10 ml-2'></div></div><div class='bg-white p-5 rounded-lg shadow-md'><p class='text-lg font-semibold text-gray-800'>“Fantastic quality and support!”</p><p class='text-gray-600 mt-2'>- Alex Johnson</p><div class='flex justify-center mt-4'><img src='trust-badge1.png' alt='Trust Badge' class='w-10 h-10'><img src='trust-badge2.png' alt='Trust Badge' class='w-10 h-10 ml-2'></div></div></div></section>
```

## `trust-bar` / `with-icons`

### Example 1: Brand Trust Badges

**When To Use**: When showcasing partnerships or certifications to build credibility.

**Why It Works**: The use of icons alongside text creates a visual hierarchy that draws attention to trusted brands, enhancing perceived reliability.

**Tailwind Notes**:
- Utilizes flexbox for alignment and spacing.
- Incorporates responsive design for mobile compatibility.
- Emphasizes contrast with background and text colors.

```html
<section class="bg-white py-8">
  <div class="container mx-auto text-center">
    <h2 class="text-2xl font-bold mb-6">Trusted by Leading Brands</h2>
    <div class="flex flex-wrap justify-center space-x-6">
      <div class="flex items-center p-4 border border-gray-200 rounded-lg shadow-md">
        <img src="/path/to/icon1.svg" alt="Brand 1" class="h-12 w-12 mr-3">
        <span class="text-lg font-medium">Brand 1</span>
      </div>
      <div class="flex items-center p-4 border border-gray-200 rounded-lg shadow-md">
        <img src="/path/to/icon2.svg" alt="Brand 2" class="h-12 w-12 mr-3">
        <span class="text-lg font-medium">Brand 2</span>
      </div>
      <div class="flex items-center p-4 border border-gray-200 rounded-lg shadow-md">
        <img src="/path/to/icon3.svg" alt="Brand 3" class="h-12 w-12 mr-3">
        <span class="text-lg font-medium">Brand 3</span>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Security and Compliance Icons

**When To Use**: Ideal for emphasizing security features or compliance certifications to instill confidence in users.

**Why It Works**: The combination of icons and concise text communicates trust quickly, while the layout ensures that each element is easily digestible.

**Tailwind Notes**:
- Uses grid layout for a clean, organized presentation.
- Incorporates ample padding for touch targets on mobile devices.
- Contrast is enhanced through background and icon colors.

```html
<section class="bg-gray-50 py-10">
  <div class="container mx-auto text-center">
    <h2 class="text-3xl font-bold mb-5">Your Security is Our Priority</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div class="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
        <img src="/path/to/security-icon.svg" alt="Secure" class="h-16 w-16 mb-4">
        <span class="text-lg font-semibold">Secure Payments</span>
      </div>
      <div class="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
        <img src="/path/to/compliance-icon.svg" alt="Compliance" class="h-16 w-16 mb-4">
        <span class="text-lg font-semibold">GDPR Compliant</span>
      </div>
      <div class="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
        <img src="/path/to/encryption-icon.svg" alt="Encryption" class="h-16 w-16 mb-4">
        <span class="text-lg font-semibold">End-to-End Encryption</span>
      </div>
      <div class="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
        <img src="/path/to/verified-icon.svg" alt="Verified" class="h-16 w-16 mb-4">
        <span class="text-lg font-semibold">Verified by Experts</span>
      </div>
    </div>
  </div>
</section>
```

## `trust-bar` / `badges`

### Example 1: Customer Trust Badges with Icons

**When To Use**: Use this layout to showcase customer trust badges prominently, especially when highlighting security, partnerships, or certifications.

**Why It Works**: The use of icons alongside text creates a visual hierarchy that draws attention. The spacing and color choices enhance readability and emphasize trust.

**Tailwind Notes**:
- Flexbox layout for alignment and distribution.
- Consistent spacing for a clean look.
- Contrast between background and text for accessibility.

```html
<section class='bg-white py-8'><div class='max-w-6xl mx-auto px-4'><h2 class='text-2xl font-bold text-center mb-6'>Trusted by Leading Brands</h2><div class='flex justify-center space-x-8'><div class='flex flex-col items-center'><img src='path/to/icon1.svg' alt='Trust Icon 1' class='w-16 h-16 mb-2'><span class='text-lg font-semibold'>Secure Payments</span></div><div class='flex flex-col items-center'><img src='path/to/icon2.svg' alt='Trust Icon 2' class='w-16 h-16 mb-2'><span class='text-lg font-semibold'>Verified Reviews</span></div><div class='flex flex-col items-center'><img src='path/to/icon3.svg' alt='Trust Icon 3' class='w-16 h-16 mb-2'><span class='text-lg font-semibold'>Money-Back Guarantee</span></div></div></div></section>
```

### Example 2: Certification Badges with Background Color

**When To Use**: Ideal for emphasizing certifications or awards that enhance credibility, especially in competitive markets.

**Why It Works**: The bold background color creates a strong visual anchor for the badges, while the white text ensures high contrast and readability. The layout is responsive, adapting to various screen sizes.

**Tailwind Notes**:
- Use of background color for emphasis.
- Responsive grid layout for flexibility.
- Consistent typography for brand alignment.

```html
<section class='bg-gray-100 py-10'><div class='max-w-6xl mx-auto px-4'><h2 class='text-2xl font-bold text-center mb-6'>Our Certifications</h2><div class='grid grid-cols-2 md:grid-cols-4 gap-6'><div class='flex flex-col items-center bg-white p-4 rounded-lg shadow'><img src='path/to/cert1.png' alt='Certification 1' class='h-20 mb-2'><span class='text-lg font-semibold'>ISO 9001</span></div><div class='flex flex-col items-center bg-white p-4 rounded-lg shadow'><img src='path/to/cert2.png' alt='Certification 2' class='h-20 mb-2'><span class='text-lg font-semibold'>GDPR Compliant</span></div><div class='flex flex-col items-center bg-white p-4 rounded-lg shadow'><img src='path/to/cert3.png' alt='Certification 3' class='h-20 mb-2'><span class='text-lg font-semibold'>PCI DSS Certified</span></div><div class='flex flex-col items-center bg-white p-4 rounded-lg shadow'><img src='path/to/cert4.png' alt='Certification 4' class='h-20 mb-2'><span class='text-lg font-semibold'>Award Winning</span></div></div></div></section>
```

## `trust-bar` / `logos`

### Example 1: Brand Partnership Showcase

**When To Use**: Use this section to highlight partnerships with well-known brands to build trust with visitors.

**Why It Works**: The use of grayscale logos with hover effects creates a polished look that emphasizes credibility while maintaining focus on the content. The spacing ensures a clean layout, and the responsive design adapts well across devices.

**Tailwind Notes**:
- Utilizes flexbox for responsive alignment.
- Grayscale logos enhance visual hierarchy.
- Hover effects provide interactivity without distraction.

```html
<section class="bg-white py-12"><div class="container mx-auto"><h2 class="text-center text-2xl font-bold mb-8">Trusted by</h2><div class="flex justify-center flex-wrap gap-8"><img src="logo1.png" alt="Brand 1" class="h-16 grayscale transition duration-300 hover:grayscale-0"/><img src="logo2.png" alt="Brand 2" class="h-16 grayscale transition duration-300 hover:grayscale-0"/><img src="logo3.png" alt="Brand 3" class="h-16 grayscale transition duration-300 hover:grayscale-0"/><img src="logo4.png" alt="Brand 4" class="h-16 grayscale transition duration-300 hover:grayscale-0"/></div></div></section>
```

### Example 2: Client Logos with Testimonials

**When To Use**: Ideal for showcasing client logos alongside brief testimonials to enhance trust and social proof.

**Why It Works**: The grid layout organizes logos and testimonials effectively, ensuring easy readability. The use of contrasting background colors and ample padding creates a visually appealing section that guides the user's eye.

**Tailwind Notes**:
- Grid layout for structured content display.
- Contrast between text and background for readability.
- Padding and margin create breathing space.

```html
<section class="bg-gray-100 py-12"><div class="container mx-auto"><h2 class="text-center text-2xl font-bold mb-8">Our Clients</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-8"><div class="text-center"><img src="client1.png" alt="Client 1" class="h-16 mx-auto mb-4"/><p class="text-sm text-gray-600">"Great service!"</p></div><div class="text-center"><img src="client2.png" alt="Client 2" class="h-16 mx-auto mb-4"/><p class="text-sm text-gray-600">"Highly recommend!"</p></div><div class="text-center"><img src="client3.png" alt="Client 3" class="h-16 mx-auto mb-4"/><p class="text-sm text-gray-600">"Very satisfied!"</p></div><div class="text-center"><img src="client4.png" alt="Client 4" class="h-16 mx-auto mb-4"/><p class="text-sm text-gray-600">"Exceptional quality!"</p></div></div></div></section>
```

## `trust-bar` / `compliance`

### Example 1: Compliance Badges with Descriptions

**When To Use**: Use this layout to showcase compliance badges along with brief descriptions for each certification, enhancing trust with potential customers.

**Why It Works**: This example uses a grid layout to maintain a clean and organized appearance. The use of contrasting colors for the background and text ensures readability, while the spacing and typography create a polished look.

**Tailwind Notes**:
- Grid layout provides a structured presentation of compliance items.
- Consistent spacing and typography enhance visual hierarchy.
- Hover effects on badges improve interactivity and engagement.

```html
<section class='bg-gray-50 py-12'><div class='container mx-auto'><h2 class='text-2xl font-semibold text-center mb-6'>Our Compliance Standards</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow'><img src='badge1.png' alt='Badge 1' class='h-16 mx-auto mb-4'><h3 class='text-lg font-medium text-center'>ISO 9001</h3><p class='text-gray-600 text-center'>Quality Management System</p></div><div class='bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow'><img src='badge2.png' alt='Badge 2' class='h-16 mx-auto mb-4'><h3 class='text-lg font-medium text-center'>GDPR Compliant</h3><p class='text-gray-600 text-center'>Data Protection Regulations</p></div><div class='bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow'><img src='badge3.png' alt='Badge 3' class='h-16 mx-auto mb-4'><h3 class='text-lg font-medium text-center'>PCI DSS</h3><p class='text-gray-600 text-center'>Payment Card Industry Standards</p></div></div></div></section>
```

### Example 2: Trust Seals with Call to Action

**When To Use**: This design is effective when you want to not only display compliance seals but also encourage users to learn more about your standards or certifications.

**Why It Works**: The combination of trust seals and a prominent call to action creates a sense of urgency and encourages users to engage further. The use of contrasting colors for the CTA button improves visibility.

**Tailwind Notes**:
- Flexbox layout allows for easy alignment of seals and CTA.
- Bold typography for the call to action draws attention.
- Ample padding and margin ensure a clean, uncluttered look.

```html
<section class='bg-white py-10'><div class='container mx-auto text-center'><h2 class='text-2xl font-bold mb-4'>Trusted by Industry Leaders</h2><div class='flex justify-center space-x-4 mb-6'><img src='seal1.png' alt='Seal 1' class='h-16'><img src='seal2.png' alt='Seal 2' class='h-16'><img src='seal3.png' alt='Seal 3' class='h-16'></div><p class='text-gray-700 mb-4'>We adhere to the highest standards of compliance and security.</p><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'>Learn More About Our Compliance</a></div></section>
```

## `trust-bar` / `review-badges`

### Example 1: Customer Review Badges

**When To Use**: Use this section to showcase customer review badges and build trust with potential clients.

**Why It Works**: The use of contrasting colors and ample spacing draws attention to the badges, while the grid layout ensures a clean, organized presentation. The responsive design adapts well to different screen sizes, maintaining visual impact.

**Tailwind Notes**:
- Use of flexbox for alignment and spacing.
- Responsive grid layout for badge display.
- Contrast between badge colors and background for emphasis.

```html
<section class='bg-white py-10'><div class='container mx-auto'><h2 class='text-center text-3xl font-bold mb-6'>Trusted by Our Customers</h2><div class='grid grid-cols-2 md:grid-cols-4 gap-6'><div class='flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-md'><img src='badge1.png' alt='Badge 1' class='h-16 mb-4'><p class='text-lg font-semibold'>4.8/5 Average Rating</p></div><div class='flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-md'><img src='badge2.png' alt='Badge 2' class='h-16 mb-4'><p class='text-lg font-semibold'>1000+ Satisfied Customers</p></div><div class='flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-md'><img src='badge3.png' alt='Badge 3' class='h-16 mb-4'><p class='text-lg font-semibold'>5-Star Service</p></div><div class='flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-md'><img src='badge4.png' alt='Badge 4' class='h-16 mb-4'><p class='text-lg font-semibold'>Top Rated in Industry</p></div></div></div></section>
```

### Example 2: Highlighted Review Badges with Call to Action

**When To Use**: Ideal for emphasizing customer trust while encouraging action, such as signing up or purchasing.

**Why It Works**: This layout combines badges with a prominent call to action, using contrasting colors to guide the user's eye. The responsive design ensures that both desktop and mobile users have an optimal experience.

**Tailwind Notes**:
- Use of background color to create contrast.
- Flexbox for vertical alignment of text and buttons.
- Padding and margin adjustments for better spacing.

```html
<section class='bg-gray-100 py-12'><div class='container mx-auto text-center'><h2 class='text-3xl font-bold mb-4'>Join Our Happy Customers!</h2><div class='flex justify-center space-x-8 mb-6'><div class='flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-md'><img src='badge1.png' alt='Badge 1' class='h-16 mb-2'><p class='text-lg font-semibold'>4.9/5 Average Rating</p></div><div class='flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-md'><img src='badge2.png' alt='Badge 2' class='h-16 mb-2'><p class='text-lg font-semibold'>Over 2000 Reviews</p></div></div><a href='#' class='bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200'>Get Started Today!</a></div></section>
```

## `logo-cloud` / `mono`

### Example 1: Simple Logo Cloud with Centered Alignment

**When To Use**: Use this layout when you want to showcase a collection of logos prominently in the center of the page, emphasizing brand partnerships or clients.

**Why It Works**: The centered alignment draws immediate attention to the logos, while the use of a subtle background color provides contrast. The responsive grid ensures logos are displayed elegantly on all devices.

**Tailwind Notes**:
- Use of flex and grid utilities for alignment and spacing.
- Background color and padding enhance visual separation.
- Responsive classes ensure logos stack appropriately on smaller screens.

```html
<section class='bg-gray-100 py-12'><div class='container mx-auto'><h2 class='text-center text-2xl font-semibold mb-8'>Trusted by</h2><div class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6'><img src='logo1.png' alt='Brand 1' class='mx-auto h-16' /><img src='logo2.png' alt='Brand 2' class='mx-auto h-16' /><img src='logo3.png' alt='Brand 3' class='mx-auto h-16' /><img src='logo4.png' alt='Brand 4' class='mx-auto h-16' /><img src='logo5.png' alt='Brand 5' class='mx-auto h-16' /><img src='logo6.png' alt='Brand 6' class='mx-auto h-16' /></div></div></section>
```

### Example 2: Horizontal Logo Cloud with Hover Effects

**When To Use**: Ideal for showcasing a series of partner logos in a horizontal layout, providing a modern touch with hover effects for interactivity.

**Why It Works**: The horizontal layout maximizes space and allows for a smooth scrolling effect on larger screens. Hover effects encourage user engagement, while consistent logo sizing maintains visual harmony.

**Tailwind Notes**:
- Flexbox for horizontal alignment and spacing.
- Transition effects for interactivity.
- Consistent height for logos ensures a clean look.

```html
<section class='bg-white py-10'><div class='container mx-auto'><h2 class='text-center text-2xl font-semibold mb-6'>Our Partners</h2><div class='flex justify-center space-x-8 overflow-x-auto'><img src='logo1.png' alt='Brand 1' class='h-14 transition-transform transform hover:scale-105' /><img src='logo2.png' alt='Brand 2' class='h-14 transition-transform transform hover:scale-105' /><img src='logo3.png' alt='Brand 3' class='h-14 transition-transform transform hover:scale-105' /><img src='logo4.png' alt='Brand 4' class='h-14 transition-transform transform hover:scale-105' /><img src='logo5.png' alt='Brand 5' class='h-14 transition-transform transform hover:scale-105' /></div></div></section>
```

### Example 3: Grid Logo Cloud with Background Image

**When To Use**: Best for visually striking presentations of logos, particularly when paired with a background image to enhance brand storytelling.

**Why It Works**: The background image adds depth and context, while the grid layout ensures logos are displayed clearly. The contrasting text color improves readability against the backdrop.

**Tailwind Notes**:
- Background image with overlay for text contrast.
- Grid layout for responsive logo arrangement.
- Padding and margins create breathing space.

```html
<section class='relative bg-cover bg-center py-20' style='background-image: url(background.jpg);'><div class='absolute inset-0 bg-black opacity-50'></div><div class='container mx-auto relative z-10'><h2 class='text-white text-center text-3xl font-bold mb-8'>Brands We Work With</h2><div class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8'><img src='logo1.png' alt='Brand 1' class='mx-auto h-20' /><img src='logo2.png' alt='Brand 2' class='mx-auto h-20' /><img src='logo3.png' alt='Brand 3' class='mx-auto h-20' /><img src='logo4.png' alt='Brand 4' class='mx-auto h-20' /><img src='logo5.png' alt='Brand 5' class='mx-auto h-20' /></div></div></section>
```

## `logo-cloud` / `full-color`

### Example 1: Brand Partnership Showcase

**When To Use**: When you want to display a collection of partner logos prominently on a marketing page.

**Why It Works**: The use of a grid layout with responsive classes ensures that logos are displayed cleanly across devices, while ample spacing and contrasting colors help each logo stand out.

**Tailwind Notes**:
- Flexbox for alignment and spacing.
- Responsive grid for different screen sizes.
- Hover effects to enhance interactivity.

```html
<section class='py-12 bg-gray-50'>
  <div class='container mx-auto text-center'>
    <h2 class='text-3xl font-bold mb-8'>Our Trusted Partners</h2>
    <div class='grid grid-cols-2 md:grid-cols-4 gap-8'>
      <div class='flex justify-center'>
        <img src='logo1.png' alt='Partner Logo 1' class='h-16 hover:scale-105 transition-transform duration-200' />
      </div>
      <div class='flex justify-center'>
        <img src='logo2.png' alt='Partner Logo 2' class='h-16 hover:scale-105 transition-transform duration-200' />
      </div>
      <div class='flex justify-center'>
        <img src='logo3.png' alt='Partner Logo 3' class='h-16 hover:scale-105 transition-transform duration-200' />
      </div>
      <div class='flex justify-center'>
        <img src='logo4.png' alt='Partner Logo 4' class='h-16 hover:scale-105 transition-transform duration-200' />
      </div>
    </div>
  </div>
</section>
```

### Example 2: Client Logos with Background Accent

**When To Use**: Ideal for showcasing client logos with a more dynamic background to draw attention.

**Why It Works**: The background color and shadow create a distinct section that separates it from other content, while the centered alignment ensures a clean presentation. The logos have a uniform size for consistency.

**Tailwind Notes**:
- Use of background color for visual separation.
- Shadow for depth and emphasis.
- Consistent logo sizing for a cohesive look.

```html
<section class='py-16 bg-white shadow-lg'>
  <div class='container mx-auto text-center'>
    <h2 class='text-4xl font-extrabold mb-6'>Proudly Serving</h2>
    <div class='flex flex-wrap justify-center'>
      <img src='logo1.png' alt='Client Logo 1' class='h-20 mx-4 my-2' />
      <img src='logo2.png' alt='Client Logo 2' class='h-20 mx-4 my-2' />
      <img src='logo3.png' alt='Client Logo 3' class='h-20 mx-4 my-2' />
      <img src='logo4.png' alt='Client Logo 4' class='h-20 mx-4 my-2' />
      <img src='logo5.png' alt='Client Logo 5' class='h-20 mx-4 my-2' />
    </div>
  </div>
</section>
```

## `logo-cloud` / `compact`

### Example 1: Client Logo Showcase

**When To Use**: Use this section to highlight notable clients or partners in a compact format, suitable for a landing page.

**Why It Works**: The use of a grid layout allows for an organized presentation of logos, while ample spacing ensures clarity. The contrast between the logos and the background emphasizes brand recognition.

**Tailwind Notes**:
- Utilizes grid layout for responsive design.
- Employs padding and margin to create breathing space.
- Background color enhances visibility of logos.

```html
<section class='bg-gray-50 py-8'><div class='container mx-auto'><h2 class='text-center text-2xl font-semibold mb-6'>Trusted by</h2><div class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6'><img src='logo1.png' alt='Client 1' class='h-12 mx-auto' /><img src='logo2.png' alt='Client 2' class='h-12 mx-auto' /><img src='logo3.png' alt='Client 3' class='h-12 mx-auto' /><img src='logo4.png' alt='Client 4' class='h-12 mx-auto' /><img src='logo5.png' alt='Client 5' class='h-12 mx-auto' /></div></div></section>
```

### Example 2: Brand Partnerships

**When To Use**: Ideal for showcasing partnerships or collaborations in a clean and concise manner on a marketing site.

**Why It Works**: The use of a horizontal layout with equal spacing provides a polished look. The subtle shadow effect adds depth and helps the logos stand out against the background.

**Tailwind Notes**:
- Horizontal layout for compact presentation.
- Shadow effect enhances visual hierarchy.
- Responsive adjustments ensure logos remain legible on all devices.

```html
<section class='bg-white shadow-md py-6'><div class='container mx-auto'><h2 class='text-center text-2xl font-bold mb-4'>Our Partners</h2><div class='flex flex-wrap justify-center space-x-4'><img src='logo1.png' alt='Partner 1' class='h-16' /><img src='logo2.png' alt='Partner 2' class='h-16' /><img src='logo3.png' alt='Partner 3' class='h-16' /><img src='logo4.png' alt='Partner 4' class='h-16' /></div></div></section>
```

### Example 3: Featured Clients

**When To Use**: Use this section to highlight a selection of prominent clients, creating credibility and trust.

**Why It Works**: The alternating background colors for each logo row enhance visual interest and guide the viewer's eye. The use of a larger logo size ensures clarity and impact.

**Tailwind Notes**:
- Alternating backgrounds for visual separation.
- Larger logo sizes improve visibility.
- Consistent spacing maintains a clean layout.

```html
<section class='py-10'><div class='container mx-auto'><h2 class='text-center text-3xl font-extrabold mb-8'>Our Esteemed Clients</h2><div class='space-y-6'><div class='flex justify-center bg-gray-100 p-4'><img src='logo1.png' alt='Client 1' class='h-20 mx-4' /><img src='logo2.png' alt='Client 2' class='h-20 mx-4' /><img src='logo3.png' alt='Client 3' class='h-20 mx-4' /></div><div class='flex justify-center bg-white p-4'><img src='logo4.png' alt='Client 4' class='h-20 mx-4' /><img src='logo5.png' alt='Client 5' class='h-20 mx-4' /><img src='logo6.png' alt='Client 6' class='h-20 mx-4' /></div></div></div></section>
```

## `logo-cloud` / `with-caption`

### Example 1: Brand Trust Section

**When To Use**: When showcasing partner logos to build credibility and trust with potential customers.

**Why It Works**: The use of a clean layout with ample spacing allows the logos to stand out, while the caption provides context, emphasizing trust. The responsive design ensures that the logos maintain a good visual hierarchy on different screen sizes.

**Tailwind Notes**:
- Flexbox is used for alignment and spacing.
- Responsive utilities ensure logos stack appropriately on smaller screens.
- Contrast between text and background enhances readability.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto text-center'><h2 class='text-3xl font-bold mb-6'>Trusted by Leading Brands</h2><div class='flex flex-wrap justify-center gap-6'><img src='logo1.png' alt='Brand 1' class='h-16' /><img src='logo2.png' alt='Brand 2' class='h-16' /><img src='logo3.png' alt='Brand 3' class='h-16' /><img src='logo4.png' alt='Brand 4' class='h-16' /></div><p class='mt-4 text-gray-600'>Join the community of satisfied customers.</p></div></section>
```

### Example 2: Client Showcase

**When To Use**: When highlighting a diverse range of clients to demonstrate market reach and versatility.

**Why It Works**: The grid layout organizes logos neatly, making it easy for users to scan through. The use of hover effects on logos adds interactivity, encouraging engagement. The caption reinforces the message of inclusivity.

**Tailwind Notes**:
- Grid layout for logos creates a structured appearance.
- Hover effects enhance user interaction.
- Responsive design ensures logos resize appropriately.

```html
<section class='py-12 bg-white'><div class='container mx-auto text-center'><h2 class='text-3xl font-bold mb-6'>Our Valued Clients</h2><div class='grid grid-cols-2 md:grid-cols-4 gap-8'><img src='client1.png' alt='Client 1' class='h-16 transition-transform transform hover:scale-105' /><img src='client2.png' alt='Client 2' class='h-16 transition-transform transform hover:scale-105' /><img src='client3.png' alt='Client 3' class='h-16 transition-transform transform hover:scale-105' /><img src='client4.png' alt='Client 4' class='h-16 transition-transform transform hover:scale-105' /></div><p class='mt-4 text-gray-600'>Proudly serving clients across various industries.</p></div></section>
```

### Example 3: Partnership Recognition

**When To Use**: When displaying logos of partners to highlight collaboration and partnerships.

**Why It Works**: The use of a subtle background color differentiates the section, while the centered layout focuses attention on the logos. The caption serves as a strong call to action, inviting potential partners to engage.

**Tailwind Notes**:
- Background color adds emphasis and distinction.
- Centered text provides a clear focal point.
- Call to action is visually distinct from the logos.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto text-center'><h2 class='text-3xl font-bold mb-6'>Our Partners</h2><div class='flex flex-wrap justify-center gap-6'><img src='partner1.png' alt='Partner 1' class='h-20' /><img src='partner2.png' alt='Partner 2' class='h-20' /><img src='partner3.png' alt='Partner 3' class='h-20' /><img src='partner4.png' alt='Partner 4' class='h-20' /></div><p class='mt-4 text-gray-600 font-semibold'>Interested in partnering with us? <a href='#' class='text-blue-600 underline'>Get in touch!</a></p></div></section>
```

## `certification-strip` / `badges`

### Example 1: Professional Certification Badges

**When To Use**: Use this layout to showcase professional certifications or partnerships prominently, ideal for service-oriented businesses or educational platforms.

**Why It Works**: The use of a grid layout ensures that badges are well-organized and visually appealing. The use of contrasting colors for the background and badges enhances visibility, while the spacing ensures clarity and focus on each badge.

**Tailwind Notes**:
- Grid layout provides responsive design, adapting to different screen sizes.
- Consistent spacing and alignment create a polished look.
- Hover effects on badges enhance interactivity and engagement.

```html
<section class='bg-gray-50 py-12'><div class='container mx-auto'><h2 class='text-3xl font-semibold text-center mb-8'>Our Certifications</h2><div class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'><div class='flex items-center justify-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow'><img src='badge1.png' alt='Certification Badge 1' class='h-16 w-auto' /></div><div class='flex items-center justify-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow'><img src='badge2.png' alt='Certification Badge 2' class='h-16 w-auto' /></div><div class='flex items-center justify-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow'><img src='badge3.png' alt='Certification Badge 3' class='h-16 w-auto' /></div><div class='flex items-center justify-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow'><img src='badge4.png' alt='Certification Badge 4' class='h-16 w-auto' /></div></div></div></section>
```

### Example 2: Accreditation Badges Display

**When To Use**: Ideal for educational institutions or professional organizations that want to highlight their accreditation and partnerships.

**Why It Works**: The horizontal layout with centered text and badges creates a balanced appearance. The use of rounded corners and shadows gives depth, while the clear typography ensures that the section is easy to read.

**Tailwind Notes**:
- Flexbox layout allows for easy centering and alignment.
- Subtle shadows add depth without overwhelming the design.
- Responsive adjustments ensure the layout remains effective on all devices.

```html
<section class='bg-white py-10'><div class='container mx-auto'><h2 class='text-4xl font-bold text-center mb-6'>Accredited By</h2><div class='flex flex-wrap justify-center space-x-4'><div class='flex items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md'><img src='accreditation1.png' alt='Accreditation Badge 1' class='h-20 w-auto' /></div><div class='flex items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md'><img src='accreditation2.png' alt='Accreditation Badge 2' class='h-20 w-auto' /></div><div class='flex items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md'><img src='accreditation3.png' alt='Accreditation Badge 3' class='h-20 w-auto' /></div></div></div></section>
```

## `certification-strip` / `icons`

### Example 1: Certification Icons with Descriptions

**When To Use**: Use this layout to highlight key certifications or partnerships visually, with short descriptions to enhance credibility.

**Why It Works**: This design leverages clear iconography paired with descriptive text, creating a visually appealing and informative layout. The use of spacing and typography helps to maintain a clean and organized appearance, while the background color provides contrast that emphasizes the certifications.

**Tailwind Notes**:
- Utilizes flexbox for responsive alignment.
- Employs consistent spacing for a polished look.
- Strong contrast between text and background enhances readability.

```html
<section class='bg-gray-100 py-8'><div class='container mx-auto'><h2 class='text-center text-3xl font-bold mb-6'>Our Trusted Certifications</h2><div class='flex flex-wrap justify-center gap-8'><div class='flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-6'><img src='icon1.png' alt='Certification 1' class='w-16 h-16 mb-4'><h3 class='text-xl font-semibold'>Certification 1</h3><p class='text-gray-600'>Description of certification 1 that highlights its importance.</p></div><div class='flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-6'><img src='icon2.png' alt='Certification 2' class='w-16 h-16 mb-4'><h3 class='text-xl font-semibold'>Certification 2</h3><p class='text-gray-600'>Description of certification 2 that highlights its importance.</p></div><div class='flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-6'><img src='icon3.png' alt='Certification 3' class='w-16 h-16 mb-4'><h3 class='text-xl font-semibold'>Certification 3</h3><p class='text-gray-600'>Description of certification 3 that highlights its importance.</p></div></div></div></section>
```

### Example 2: Grid of Certification Badges

**When To Use**: Ideal for showcasing multiple certifications in a compact grid format, perfect for landing pages with limited space.

**Why It Works**: The grid layout maximizes space and allows for easy scanning of certifications. Each badge is distinct, with ample padding and hover effects that invite interaction, enhancing user engagement.

**Tailwind Notes**:
- Grid layout ensures responsiveness and adaptability.
- Hover effects on badges increase interactivity.
- Consistent padding and margin create a balanced appearance.

```html
<section class='bg-white py-12'><div class='container mx-auto'><h2 class='text-center text-3xl font-bold mb-8'>Certifications We Hold</h2><div class='grid grid-cols-2 md:grid-cols-4 gap-6'><div class='flex flex-col items-center bg-gray-200 p-4 rounded-lg transition-transform transform hover:scale-105'><img src='badge1.png' alt='Badge 1' class='w-20 h-20 mb-2'><h3 class='text-lg font-semibold'>Badge 1</h3></div><div class='flex flex-col items-center bg-gray-200 p-4 rounded-lg transition-transform transform hover:scale-105'><img src='badge2.png' alt='Badge 2' class='w-20 h-20 mb-2'><h3 class='text-lg font-semibold'>Badge 2</h3></div><div class='flex flex-col items-center bg-gray-200 p-4 rounded-lg transition-transform transform hover:scale-105'><img src='badge3.png' alt='Badge 3' class='w-20 h-20 mb-2'><h3 class='text-lg font-semibold'>Badge 3</h3></div><div class='flex flex-col items-center bg-gray-200 p-4 rounded-lg transition-transform transform hover:scale-105'><img src='badge4.png' alt='Badge 4' class='w-20 h-20 mb-2'><h3 class='text-lg font-semibold'>Badge 4</h3></div></div></div></section>
```

## `certification-strip` / `stacked`

### Example 1: Professional Certifications Showcase

**When To Use**: Use this layout to highlight multiple professional certifications in a visually appealing manner, suitable for a landing page aimed at showcasing expertise.

**Why It Works**: The use of contrasting colors, ample spacing, and clear typography helps to create a polished and professional appearance, while the CTA is emphasized for user engagement.

**Tailwind Notes**:
- Utilizes flexbox for easy alignment and spacing.
- Contrast between background and text colors enhances readability.
- Responsive design ensures a good look on all devices.

```html
<section class="bg-gray-100 p-8">
  <h2 class="text-3xl font-bold text-center mb-6">Our Certifications</h2>
  <div class="flex flex-col md:flex-row justify-center gap-6">
    <div class="bg-white shadow-lg rounded-lg p-6 flex-1">
      <h3 class="text-xl font-semibold">Certified Scrum Master</h3>
      <p class="text-gray-600 mb-4">Achieved by mastering Agile methodologies.</p>
      <a href="#" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Learn More</a>
    </div>
    <div class="bg-white shadow-lg rounded-lg p-6 flex-1">
      <h3 class="text-xl font-semibold">AWS Certified Solutions Architect</h3>
      <p class="text-gray-600 mb-4">Proven expertise in designing distributed systems.</p>
      <a href="#" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Learn More</a>
    </div>
    <div class="bg-white shadow-lg rounded-lg p-6 flex-1">
      <h3 class="text-xl font-semibold">Google Analytics Certified</h3>
      <p class="text-gray-600 mb-4">Expertise in data-driven decision making.</p>
      <a href="#" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Learn More</a>
    </div>
  </div>
</section>
```

### Example 2: Certification Badges Section

**When To Use**: Ideal for showcasing certification badges in a stacked format, perfect for a marketing site that emphasizes credibility.

**Why It Works**: The design uses a clean layout with sufficient white space and visual hierarchy, making it easy for users to scan through the certifications. The badges are visually distinct and the CTA is prominent.

**Tailwind Notes**:
- Stacked layout ensures clear visibility of each certification.
- Hover effects on buttons enhance interactivity.
- Responsive design adjusts layout for mobile screens.

```html
<section class="bg-white p-10">
  <h2 class="text-3xl font-bold text-center mb-8">Our Trusted Certifications</h2>
  <div class="flex flex-col md:flex-row justify-center items-center gap-8">
    <div class="bg-gray-200 rounded-lg p-5 text-center">
      <img src="/path/to/cert1.png" alt="Certification 1" class="w-24 h-24 mx-auto mb-4">
      <h3 class="text-xl font-semibold">Certified Data Analyst</h3>
      <p class="text-gray-500">Recognized for data analysis skills.</p>
      <a href="#" class="mt-4 inline-block bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition">View Details</a>
    </div>
    <div class="bg-gray-200 rounded-lg p-5 text-center">
      <img src="/path/to/cert2.png" alt="Certification 2" class="w-24 h-24 mx-auto mb-4">
      <h3 class="text-xl font-semibold">Certified UX Designer</h3>
      <p class="text-gray-500">Expertise in user experience design.</p>
      <a href="#" class="mt-4 inline-block bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition">View Details</a>
    </div>
    <div class="bg-gray-200 rounded-lg p-5 text-center">
      <img src="/path/to/cert3.png" alt="Certification 3" class="w-24 h-24 mx-auto mb-4">
      <h3 class="text-xl font-semibold">Certified Project Manager</h3>
      <p class="text-gray-500">Proven project management expertise.</p>
      <a href="#" class="mt-4 inline-block bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition">View Details</a>
    </div>
  </div>
</section>
```

## `review-strip` / `stars`

### Example 1: Customer Testimonials with Star Ratings

**When To Use**: Use this layout to showcase customer reviews prominently on a landing page, emphasizing star ratings to build trust.

**Why It Works**: The combination of high-contrast colors, clear typography, and ample spacing enhances readability and draws attention to the testimonials, making them more persuasive.

**Tailwind Notes**:
- Use flexbox for alignment and spacing to ensure responsiveness.
- Star ratings are visually engaging and quickly convey quality.
- Background color contrasts with text for better visibility.

```html
<section class='bg-gray-50 py-12'><div class='container mx-auto'><h2 class='text-2xl font-bold text-center mb-6'>What Our Customers Say</h2><div class='flex flex-wrap justify-center gap-6'><div class='bg-white shadow-lg rounded-lg p-6 max-w-xs'><div class='flex items-center mb-4'><span class='text-yellow-500'>⭐⭐⭐⭐⭐</span><span class='ml-2 text-gray-600'>John D.</span></div><p class='text-gray-700'>This product changed my life! Highly recommend it to everyone.</p></div><div class='bg-white shadow-lg rounded-lg p-6 max-w-xs'><div class='flex items-center mb-4'><span class='text-yellow-500'>⭐⭐⭐⭐</span><span class='ml-2 text-gray-600'>Jane S.</span></div><p class='text-gray-700'>Great service and fast delivery. Will order again!</p></div></div></div></section>
```

### Example 2: Highlighted Reviews with Star Ratings

**When To Use**: Ideal for a marketing site where you want to highlight a few standout reviews to entice potential customers.

**Why It Works**: Using larger cards with bold typography and star ratings creates a focal point that captures attention, while the layout remains clean and organized.

**Tailwind Notes**:
- Increased card size for emphasis on key testimonials.
- Consistent spacing and alignment improve visual hierarchy.
- Responsive design ensures readability on all devices.

```html
<section class='bg-white py-16'><div class='container mx-auto'><h2 class='text-3xl font-semibold text-center mb-8'>See What Others Are Saying</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-gray-100 p-6 rounded-lg shadow-md'><div class='flex items-center mb-4'><span class='text-yellow-500 text-2xl'>⭐⭐⭐⭐⭐</span><span class='ml-3 text-gray-800 font-medium'>Alex R.</span></div><p class='text-gray-600'>Absolutely fantastic! I couldn't be happier with my purchase.</p></div><div class='bg-gray-100 p-6 rounded-lg shadow-md'><div class='flex items-center mb-4'><span class='text-yellow-500 text-2xl'>⭐⭐⭐⭐</span><span class='ml-3 text-gray-800 font-medium'>Sara L.</span></div><p class='text-gray-600'>The quality is unmatched. Will definitely buy again!</p></div><div class='bg-gray-100 p-6 rounded-lg shadow-md'><div class='flex items-center mb-4'><span class='text-yellow-500 text-2xl'>⭐⭐⭐⭐⭐</span><span class='ml-3 text-gray-800 font-medium'>Mike W.</span></div><p class='text-gray-600'>Great experience from start to finish!</p></div></div></div></section>
```

## `review-strip` / `platform-badges`

### Example 1: Customer Platform Badges with Testimonials

**When To Use**: Use this layout when you want to showcase customer reviews alongside platform badges to build trust and credibility.

**Why It Works**: The combination of well-placed badges and testimonials creates a visually appealing section that highlights user satisfaction while reinforcing brand authority.

**Tailwind Notes**:
- Flexbox layout for responsive arrangement.
- Use of contrasting colors for badges to stand out.
- Spacing and typography enhance readability and visual hierarchy.

```html
<section class='bg-gray-50 py-12'><div class='container mx-auto px-4'><h2 class='text-2xl font-bold text-center mb-6'>What Our Customers Say</h2><div class='flex flex-wrap justify-center gap-6'><div class='bg-white shadow-md rounded-lg p-6 max-w-xs'><p class='text-gray-700 mb-4'>“This platform has transformed our workflow!”</p><div class='flex justify-center'><span class='bg-blue-500 text-white px-3 py-1 rounded-full text-sm'>Trusted by 10,000+</span></div></div><div class='bg-white shadow-md rounded-lg p-6 max-w-xs'><p class='text-gray-700 mb-4'>“An essential tool for our team.”</p><div class='flex justify-center'><span class='bg-green-500 text-white px-3 py-1 rounded-full text-sm'>5-Star Rated</span></div></div></div></div></section>
```

### Example 2: Platform Badges with Call to Action

**When To Use**: Ideal for landing pages where you want to emphasize platform credibility while driving users to a specific action.

**Why It Works**: The clear call to action paired with visually distinct badges encourages users to engage, while the layout maintains a clean and professional appearance.

**Tailwind Notes**:
- Bold typography for emphasis on the CTA.
- Responsive design ensures accessibility on all devices.
- Use of whitespace to avoid clutter and improve focus.

```html
<section class='bg-white py-16'><div class='container mx-auto px-4 text-center'><h2 class='text-3xl font-extrabold mb-4'>Join the Leading Platforms</h2><p class='text-lg text-gray-600 mb-8'>Experience the best with our trusted solutions.</p><div class='flex justify-center gap-4 mb-6'><span class='bg-yellow-400 text-white px-4 py-2 rounded-full text-sm'>Top Rated</span><span class='bg-red-500 text-white px-4 py-2 rounded-full text-sm'>Most Recommended</span><span class='bg-blue-600 text-white px-4 py-2 rounded-full text-sm'>User Favorite</span></div><a href='#' class='bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition'>Get Started Today</a></div></section>
```

## `review-strip` / `snippets`

### Example 1: Customer Testimonials Carousel

**When To Use**: When you want to showcase multiple customer reviews in a rotating carousel format to engage users.

**Why It Works**: The carousel format allows for a compact display of multiple testimonials without overwhelming the user, while the use of clear typography and ample spacing enhances readability and focus on each review.

**Tailwind Notes**:
- Flexbox for centering and alignment.
- Responsive typography for readability across devices.
- Hover effects on CTA to encourage interaction.

```html
<section class='py-12 bg-gray-50'>
  <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <h2 class='text-3xl font-extrabold text-gray-900 text-center mb-8'>What Our Customers Say</h2>
    <div class='flex overflow-x-scroll space-x-4'>
      <div class='flex-none w-80 bg-white rounded-lg shadow-lg p-6'>
        <p class='text-gray-700 mb-4'>“This product changed my life! Highly recommend.”</p>
        <p class='font-semibold text-gray-900'>- Jane Doe</p>
      </div>
      <div class='flex-none w-80 bg-white rounded-lg shadow-lg p-6'>
        <p class='text-gray-700 mb-4'>“Excellent service and great quality!”</p>
        <p class='font-semibold text-gray-900'>- John Smith</p>
      </div>
      <div class='flex-none w-80 bg-white rounded-lg shadow-lg p-6'>
        <p class='text-gray-700 mb-4'>“A fantastic experience from start to finish.”</p>
        <p class='font-semibold text-gray-900'>- Emily Johnson</p>
      </div>
    </div>
    <div class='text-center mt-8'>
      <a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>See More Reviews</a>
    </div>
  </div>
</section>
```

### Example 2: Grid of Customer Reviews

**When To Use**: When you want to display a collection of customer reviews in a grid layout to provide a comprehensive view.

**Why It Works**: The grid layout allows for a visually appealing presentation of reviews, making it easy for users to scan through. The use of contrasting colors and spacing draws attention to each review card, while the responsive design ensures accessibility on all devices.

**Tailwind Notes**:
- Grid layout for responsive design.
- Consistent padding and margin for uniformity.
- Use of background colors to create contrast.

```html
<section class='py-12 bg-white'>
  <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <h2 class='text-3xl font-extrabold text-gray-900 text-center mb-8'>Hear From Our Happy Customers</h2>
    <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div class='bg-gray-100 rounded-lg shadow-md p-6'>
        <p class='text-gray-700 mb-4'>“Amazing quality and fast shipping!”</p>
        <p class='font-semibold text-gray-900'>- Sarah Lee</p>
      </div>
      <div class='bg-gray-100 rounded-lg shadow-md p-6'>
        <p class='text-gray-700 mb-4'>“Customer service was outstanding!”</p>
        <p class='font-semibold text-gray-900'>- Michael Brown</p>
      </div>
      <div class='bg-gray-100 rounded-lg shadow-md p-6'>
        <p class='text-gray-700 mb-4'>“I will definitely be a returning customer!”</p>
        <p class='font-semibold text-gray-900'>- Anna White</p>
      </div>
    </div>
    <div class='text-center mt-8'>
      <a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Read More Reviews</a>
    </div>
  </div>
</section>
```

### Example 3: Highlighted Review Snippet

**When To Use**: When you want to feature a standout review prominently on the page to draw attention.

**Why It Works**: By using a larger card with distinct colors and a highlighted layout, it emphasizes the importance of this review. The clear call-to-action encourages users to engage further, while the layout maintains a clean and professional appearance.

**Tailwind Notes**:
- Larger card for emphasis.
- Bold typography for standout text.
- High contrast for CTA to attract clicks.

```html
<section class='py-12 bg-gray-50'>
  <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <h2 class='text-3xl font-extrabold text-gray-900 text-center mb-8'>Customer Spotlight</h2>
    <div class='bg-white rounded-lg shadow-lg p-8 mb-8'>
      <p class='text-lg text-gray-700 mb-4'>“This is the best investment I’ve made. The results speak for themselves!”</p>
      <p class='font-bold text-gray-900'>- Chris Green</p>
    </div>
    <div class='text-center'>
      <a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Discover More</a>
    </div>
  </div>
</section>
```

## `features` / `icon-grid`

### Example 1: Feature Highlights with Icons

**When To Use**: Use this layout to showcase key features of a product or service in a visually appealing grid format.

**Why It Works**: The grid layout allows for easy scanning of features, while the use of icons adds a visual element that enhances understanding and retention. The intentional spacing and typography create a clean, professional look.

**Tailwind Notes**:
- Flexbox is used for responsive layout adjustments.
- Icons provide visual cues that improve comprehension.
- Consistent padding and margin create a balanced layout.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Key Features</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white p-6 rounded-lg shadow-md text-center'><div class='mb-4'><svg class='w-12 h-12 mx-auto text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Feature One</h3><p class='text-gray-600'>Description of feature one that highlights its benefits and usage.</p></div><div class='bg-white p-6 rounded-lg shadow-md text-center'><div class='mb-4'><svg class='w-12 h-12 mx-auto text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Feature Two</h3><p class='text-gray-600'>Description of feature two that highlights its benefits and usage.</p></div><div class='bg-white p-6 rounded-lg shadow-md text-center'><div class='mb-4'><svg class='w-12 h-12 mx-auto text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Feature Three</h3><p class='text-gray-600'>Description of feature three that highlights its benefits and usage.</p></div></div></div></section>
```

### Example 2: Feature Icons with Call to Action

**When To Use**: This layout is ideal for emphasizing features while driving users to take action, such as signing up or learning more.

**Why It Works**: The combination of feature icons and a strong CTA encourages user engagement. The layout is responsive and maintains visual hierarchy, ensuring that the most important information stands out.

**Tailwind Notes**:
- Use of flexbox for alignment of the CTA with the feature grid.
- Color contrast between background and text enhances readability.
- Hover effects on buttons improve interactivity.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Discover Our Features</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'><div class='bg-gray-100 p-6 rounded-lg shadow-lg text-center'><div class='mb-4'><svg class='w-12 h-12 mx-auto text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Feature A</h3><p class='text-gray-700'>Brief description that explains the feature and its impact.</p></div><div class='bg-gray-100 p-6 rounded-lg shadow-lg text-center'><div class='mb-4'><svg class='w-12 h-12 mx-auto text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Feature B</h3><p class='text-gray-700'>Brief description that explains the feature and its impact.</p></div><div class='bg-gray-100 p-6 rounded-lg shadow-lg text-center'><div class='mb-4'><svg class='w-12 h-12 mx-auto text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Feature C</h3><p class='text-gray-700'>Brief description that explains the feature and its impact.</p></div></div><div class='text-center mt-10'><a href='#' class='bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300'>Learn More</a></div></div></section>
```

## `features` / `cards`

### Example 1: Feature Highlights with Icons

**When To Use**: Use this layout to showcase key features of a product with accompanying icons for visual appeal.

**Why It Works**: The use of icons alongside text provides visual interest and helps users quickly understand the features. The card layout allows for easy scanning, while the spacing ensures clarity.

**Tailwind Notes**:
- Flexbox layout for responsiveness
- Consistent spacing using padding and margin utilities
- Hover effects to enhance interactivity

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-10'>Our Features</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><div class='flex items-center mb-4'><img src='icon1.svg' alt='Feature 1' class='w-12 h-12 mr-3'><h3 class='text-xl font-semibold'>Feature One</h3></div><p class='text-gray-700'>Description of the first feature highlighting its benefits and usability.</p></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><div class='flex items-center mb-4'><img src='icon2.svg' alt='Feature 2' class='w-12 h-12 mr-3'><h3 class='text-xl font-semibold'>Feature Two</h3></div><p class='text-gray-700'>Description of the second feature emphasizing its advantages.</p></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><div class='flex items-center mb-4'><img src='icon3.svg' alt='Feature 3' class='w-12 h-12 mr-3'><h3 class='text-xl font-semibold'>Feature Three</h3></div><p class='text-gray-700'>Description of the third feature and how it stands out.</p></div></div></div></section>
```

### Example 2: Feature Cards with Call to Action

**When To Use**: Ideal for emphasizing features while encouraging users to take action, such as signing up or learning more.

**Why It Works**: The combination of feature descriptions with a prominent call-to-action button drives user engagement. The use of contrasting colors helps the CTA stand out.

**Tailwind Notes**:
- Utilization of background colors for visual hierarchy
- Clear CTA button styling to enhance clickability
- Responsive grid layout for varying screen sizes

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-10'>Why Choose Us?</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-gray-100 shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Feature One</h3><p class='text-gray-600 mb-4'>Brief description of the first feature and its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-gray-100 shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Feature Two</h3><p class='text-gray-600 mb-4'>Brief description of the second feature emphasizing its advantages.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-gray-100 shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Feature Three</h3><p class='text-gray-600 mb-4'>Brief description of the third feature and how it stands out.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div></div></section>
```

## `features` / `rows`

### Example 1: Feature Highlights with Icons

**When To Use**: Use this layout to showcase key features of a product with accompanying icons for visual appeal.

**Why It Works**: The use of icons alongside text creates a clear visual hierarchy, making it easy for users to scan and understand the features quickly. The responsive design ensures that the layout adapts well to different screen sizes, maintaining readability.

**Tailwind Notes**:
- Flexbox is used for horizontal alignment of feature items.
- Padding and margin utilities ensure adequate spacing between elements.
- Text colors and background contrast improve readability.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Key Features</h2><div class='flex flex-wrap justify-center space-x-4 space-y-8'><div class='flex flex-col items-center w-full sm:w-1/3 p-4'><div class='bg-white shadow-lg rounded-lg p-6'><img src='icon1.svg' alt='Feature 1' class='w-16 h-16 mb-4'><h3 class='text-xl font-semibold mb-2'>Feature One</h3><p class='text-gray-600'>Description of feature one explaining its benefits.</p></div></div><div class='flex flex-col items-center w-full sm:w-1/3 p-4'><div class='bg-white shadow-lg rounded-lg p-6'><img src='icon2.svg' alt='Feature 2' class='w-16 h-16 mb-4'><h3 class='text-xl font-semibold mb-2'>Feature Two</h3><p class='text-gray-600'>Description of feature two explaining its benefits.</p></div></div><div class='flex flex-col items-center w-full sm:w-1/3 p-4'><div class='bg-white shadow-lg rounded-lg p-6'><img src='icon3.svg' alt='Feature 3' class='w-16 h-16 mb-4'><h3 class='text-xl font-semibold mb-2'>Feature Three</h3><p class='text-gray-600'>Description of feature three explaining its benefits.</p></div></div></div></div></section>
```

### Example 2: Feature Comparison Rows

**When To Use**: Ideal for comparing multiple features side by side, especially when highlighting differences between plans or versions of a product.

**Why It Works**: This layout utilizes a grid system to present features clearly, allowing users to easily compare options. The use of contrasting colors for the background and text enhances visibility and focus on the features.

**Tailwind Notes**:
- Grid layout provides a structured and organized presentation.
- Hover effects on feature rows enhance interactivity.
- Responsive classes ensure that the layout stacks vertically on smaller screens.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Feature Comparison</h2><div class='grid grid-cols-1 sm:grid-cols-2 gap-6'><div class='bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'><h3 class='text-xl font-semibold mb-2'>Basic Plan</h3><p class='text-gray-700 mb-4'>Basic features included in this plan.</p><ul class='list-disc list-inside'><li class='mb-2'>Feature A</li><li class='mb-2'>Feature B</li><li class='mb-2'>Feature C</li></ul></div><div class='bg-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'><h3 class='text-xl font-semibold mb-2'>Pro Plan</h3><p class='text-gray-700 mb-4'>Advanced features included in this plan.</p><ul class='list-disc list-inside'><li class='mb-2'>Feature A</li><li class='mb-2'>Feature B</li><li class='mb-2'>Feature C</li><li class='mb-2'>Feature D</li></ul></div></div></div></section>
```

## `features` / `list-with-icons`

### Example 1: Feature List with Icons for SaaS Product

**When To Use**: When showcasing key features of a software product with accompanying icons to enhance visual appeal.

**Why It Works**: The use of icons alongside text creates a clear visual hierarchy, making it easier for users to scan and understand the features. The thoughtful spacing and contrast help each feature stand out.

**Tailwind Notes**:
- Flexbox utilities for alignment and spacing.
- Consistent icon size and spacing for uniformity.
- Responsive design ensures usability on all devices.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Key Features</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='flex items-start p-6 bg-white shadow-lg rounded-lg'><div class='flex-shrink-0'><svg class='w-12 h-12 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='...'/></svg></div><div class='ml-4'><h3 class='text-xl font-semibold'>Feature One</h3><p class='mt-2 text-gray-600'>Description of feature one that explains its benefits.</p></div></div><div class='flex items-start p-6 bg-white shadow-lg rounded-lg'><div class='flex-shrink-0'><svg class='w-12 h-12 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='...'/></svg></div><div class='ml-4'><h3 class='text-xl font-semibold'>Feature Two</h3><p class='mt-2 text-gray-600'>Description of feature two that explains its benefits.</p></div></div><div class='flex items-start p-6 bg-white shadow-lg rounded-lg'><div class='flex-shrink-0'><svg class='w-12 h-12 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='...'/></svg></div><div class='ml-4'><h3 class='text-xl font-semibold'>Feature Three</h3><p class='mt-2 text-gray-600'>Description of feature three that explains its benefits.</p></div></div></div></div></section>
```

### Example 2: Feature Highlights for E-commerce Platform

**When To Use**: Ideal for highlighting unique selling points of an e-commerce platform with a focus on visual storytelling.

**Why It Works**: The combination of icons and descriptive text creates an engaging narrative around the features, while the card layout allows for easy scanning. The use of shadows and rounded corners adds a modern touch.

**Tailwind Notes**:
- Use of shadows and rounded corners for a polished card effect.
- Responsive grid layout for adaptability on different screen sizes.
- Emphasis on typography to guide user attention.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Why Choose Us</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'><div class='flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow'><svg class='w-16 h-16 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='...'/></svg><h3 class='mt-4 text-lg font-semibold'>Fast Shipping</h3><p class='mt-2 text-gray-700'>Get your orders delivered in record time.</p></div><div class='flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow'><svg class='w-16 h-16 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='...'/></svg><h3 class='mt-4 text-lg font-semibold'>Secure Payments</h3><p class='mt-2 text-gray-700'>Your transactions are safe and secure with us.</p></div><div class='flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow'><svg class='w-16 h-16 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='...'/></svg><h3 class='mt-4 text-lg font-semibold'>24/7 Support</h3><p class='mt-2 text-gray-700'>We're here to help you anytime you need.</p></div><div class='flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow'><svg class='w-16 h-16 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='...'/></svg><h3 class='mt-4 text-lg font-semibold'>Easy Returns</h3><p class='mt-2 text-gray-700'>Hassle-free returns for your peace of mind.</p></div></div></div></section>
```

## `features` / `image-cards`

### Example 1: Feature Highlights with Image Cards

**When To Use**: Use this layout to showcase key features of a product or service with accompanying images that enhance visual engagement.

**Why It Works**: The use of a grid layout allows for a clean presentation of multiple features, while the combination of images and text creates a balanced visual hierarchy. The spacing and responsive design ensure that the section looks polished on all devices.

**Tailwind Notes**:
- Flexbox grid for responsive layout
- Consistent padding and margin for visual balance
- Emphasis on CTAs with contrasting colors

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-12'>Our Key Features</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white shadow-md rounded-lg overflow-hidden'><img src='feature1.jpg' alt='Feature 1' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Feature One</h3><p class='text-gray-600 mb-4'>Description of feature one that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500'>Learn More</a></div></div><div class='bg-white shadow-md rounded-lg overflow-hidden'><img src='feature2.jpg' alt='Feature 2' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Feature Two</h3><p class='text-gray-600 mb-4'>Description of feature two that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500'>Learn More</a></div></div><div class='bg-white shadow-md rounded-lg overflow-hidden'><img src='feature3.jpg' alt='Feature 3' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Feature Three</h3><p class='text-gray-600 mb-4'>Description of feature three that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500'>Learn More</a></div></div></div></div></section>
```

### Example 2: Feature Cards with Icons

**When To Use**: Ideal for emphasizing features that are visually represented by icons, making it suitable for tech or service-oriented products.

**Why It Works**: Using icons instead of images can create a more modern and minimalistic feel. The layout is designed to be responsive and touch-friendly, ensuring usability across devices.

**Tailwind Notes**:
- Icon integration for visual appeal
- Hover effects for interactivity
- Clear typography for readability

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-12'>Features You’ll Love</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'><div class='flex flex-col items-center text-center bg-gray-100 p-6 rounded-lg shadow-lg'><img src='icon1.svg' alt='Icon 1' class='w-16 h-16 mb-4'><h3 class='text-xl font-semibold mb-2'>Fast Performance</h3><p class='text-gray-500'>Experience lightning-fast load times and smooth interactions.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500'>Discover More</a></div><div class='flex flex-col items-center text-center bg-gray-100 p-6 rounded-lg shadow-lg'><img src='icon2.svg' alt='Icon 2' class='w-16 h-16 mb-4'><h3 class='text-xl font-semibold mb-2'>User Friendly</h3><p class='text-gray-500'>Intuitive design that makes navigation a breeze.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500'>Discover More</a></div><div class='flex flex-col items-center text-center bg-gray-100 p-6 rounded-lg shadow-lg'><img src='icon3.svg' alt='Icon 3' class='w-16 h-16 mb-4'><h3 class='text-xl font-semibold mb-2'>Secure & Reliable</h3><p class='text-gray-500'>Your data is safe with us, always.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500'>Discover More</a></div><div class='flex flex-col items-center text-center bg-gray-100 p-6 rounded-lg shadow-lg'><img src='icon4.svg' alt='Icon 4' class='w-16 h-16 mb-4'><h3 class='text-xl font-semibold mb-2'>24/7 Support</h3><p class='text-gray-500'>We are here to help you anytime.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500'>Discover More</a></div></div></div></section>
```

## `features` / `comparison-cards`

### Example 1: Feature Comparison Cards

**When To Use**: Use this layout when you want to highlight multiple features or products side by side, making it easy for users to compare their benefits.

**Why It Works**: The grid layout provides a clear visual hierarchy, while the use of contrasting colors and ample whitespace draws attention to each card's content. The responsive design ensures usability across devices.

**Tailwind Notes**:
- Grid layout ensures equal spacing and alignment.
- Hover effects enhance interactivity and engagement.
- Responsive breakpoints maintain usability on smaller screens.

```html
<section class="py-12 bg-gray-50">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Compare Our Features</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-xl font-semibold mb-4">Feature A</h3>
        <p class="text-gray-700 mb-4">Description of Feature A that highlights its uniqueness and advantages.</p>
        <a href="#" class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</a>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-xl font-semibold mb-4">Feature B</h3>
        <p class="text-gray-700 mb-4">Description of Feature B emphasizing its key benefits and why it stands out.</p>
        <a href="#" class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</a>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-xl font-semibold mb-4">Feature C</h3>
        <p class="text-gray-700 mb-4">Description of Feature C, showcasing its strengths and how it solves user problems.</p>
        <a href="#" class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</a>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Feature Comparison with Icons

**When To Use**: Ideal for visually driven content where icons can enhance understanding of features, making them more memorable and engaging.

**Why It Works**: Incorporating icons adds a visual element that captures attention and aids in comprehension. The use of contrasting backgrounds and clear typography ensures readability and focus on CTAs.

**Tailwind Notes**:
- Icon usage provides visual cues that enhance user understanding.
- Contrast between card backgrounds and text improves readability.
- Consistent padding and margin create a balanced layout.

```html
<section class="py-12 bg-white">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-gray-100 p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <img src="/path/to/icon-a.svg" alt="Feature A Icon" class="w-12 h-12 mr-3">
          <h3 class="text-xl font-semibold">Feature A</h3>
        </div>
        <p class="text-gray-600">Detailed explanation of Feature A and its advantages.</p>
        <a href="#" class="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Discover More</a>
      </div>
      <div class="bg-gray-100 p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <img src="/path/to/icon-b.svg" alt="Feature B Icon" class="w-12 h-12 mr-3">
          <h3 class="text-xl font-semibold">Feature B</h3>
        </div>
        <p class="text-gray-600">Insightful description of Feature B and its key selling points.</p>
        <a href="#" class="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Discover More</a>
      </div>
      <div class="bg-gray-100 p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <img src="/path/to/icon-c.svg" alt="Feature C Icon" class="w-12 h-12 mr-3">
          <h3 class="text-xl font-semibold">Feature C</h3>
        </div>
        <p class="text-gray-600">Comprehensive overview of Feature C and its benefits.</p>
        <a href="#" class="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Discover More</a>
      </div>
    </div>
  </div>
</section>
```

## `benefits` / `icon-list`

### Example 1: Feature Highlights

**When To Use**: Use this layout to showcase key features or benefits of a product or service, making it visually appealing and easy to digest.

**Why It Works**: The use of icons paired with concise text creates an engaging visual hierarchy that draws the user's attention to each benefit. The spacing and responsive layout ensure that it looks polished on any device.

**Tailwind Notes**:
- Flexbox layout for alignment and spacing.
- Consistent icon size to maintain visual balance.
- Clear CTAs with contrasting colors for emphasis.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Why Choose Us?</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='flex items-start p-6 bg-white shadow-md rounded-lg'><div class='flex-shrink-0'><svg class='w-8 h-8 text-blue-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 3h18v18H3V3z'/></svg></div><div class='ml-4'><h3 class='text-xl font-semibold'>High Quality</h3><p class='text-gray-600'>Our products are made with the best materials to ensure durability.</p></div></div><div class='flex items-start p-6 bg-white shadow-md rounded-lg'><div class='flex-shrink-0'><svg class='w-8 h-8 text-blue-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 3h18v18H3V3z'/></svg></div><div class='ml-4'><h3 class='text-xl font-semibold'>Affordable Prices</h3><p class='text-gray-600'>We offer competitive pricing without compromising quality.</p></div></div><div class='flex items-start p-6 bg-white shadow-md rounded-lg'><div class='flex-shrink-0'><svg class='w-8 h-8 text-blue-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 3h18v18H3V3z'/></svg></div><div class='ml-4'><h3 class='text-xl font-semibold'>Excellent Support</h3><p class='text-gray-600'>Our team is here to assist you 24/7 with any inquiries.</p></div></div></div></div></section>
```

### Example 2: Key Advantages

**When To Use**: Ideal for highlighting the unique selling propositions of a service, especially in a competitive market.

**Why It Works**: The layout effectively uses a card style to separate each benefit, making it easy for users to scan. The use of contrasting colors for text and background enhances readability and focus.

**Tailwind Notes**:
- Cards with shadows provide depth and separation.
- Responsive grid ensures optimal layout on all devices.
- Emphasis on typography for clarity and engagement.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-10'>Our Benefits</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'><div class='bg-gray-100 p-5 rounded-lg shadow-lg'><div class='flex justify-center mb-4'><svg class='w-12 h-12 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4'/></svg></div><h3 class='text-xl font-semibold text-center'>Time-Saving</h3><p class='text-gray-700 text-center'>Our solutions streamline your workflow, saving you valuable time.</p></div><div class='bg-gray-100 p-5 rounded-lg shadow-lg'><div class='flex justify-center mb-4'><svg class='w-12 h-12 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4'/></svg></div><h3 class='text-xl font-semibold text-center'>User-Friendly</h3><p class='text-gray-700 text-center'>Designed with the user experience in mind for easy navigation.</p></div><div class='bg-gray-100 p-5 rounded-lg shadow-lg'><div class='flex justify-center mb-4'><svg class='w-12 h-12 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4'/></svg></div><h3 class='text-xl font-semibold text-center'>Customizable</h3><p class='text-gray-700 text-center'>Easily adapt our services to fit your unique needs.</p></div><div class='bg-gray-100 p-5 rounded-lg shadow-lg'><div class='flex justify-center mb-4'><svg class='w-12 h-12 text-green-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4'/></svg></div><h3 class='text-xl font-semibold text-center'>Secure</h3><p class='text-gray-700 text-center'>We prioritize your data security with top-notch measures.</p></div></div></div></section>
```

## `benefits` / `cards`

### Example 1: Three Feature Cards with Icons

**When To Use**: Use this layout to highlight key features or benefits of a product or service, ideal for a marketing landing page.

**Why It Works**: The use of icons with text creates a clear visual hierarchy, while the card layout allows for easy scanning. The spacing and background colors enhance readability and focus on each benefit.

**Tailwind Notes**:
- bg-white for card background color to ensure contrast with the section background.
- shadow-lg to add depth and make the cards stand out.
- p-6 for comfortable padding inside the cards.
- text-center to center align the content for better aesthetics.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Why Choose Us?</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-white shadow-lg p-6 rounded-lg'><div class='flex justify-center mb-4'><svg class='h-12 w-12 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Feature One</h3><p class='text-gray-600'>Description of the first feature that highlights its benefits and value.</p></div><div class='bg-white shadow-lg p-6 rounded-lg'><div class='flex justify-center mb-4'><svg class='h-12 w-12 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Feature Two</h3><p class='text-gray-600'>Description of the second feature that highlights its benefits and value.</p></div><div class='bg-white shadow-lg p-6 rounded-lg'><div class='flex justify-center mb-4'><svg class='h-12 w-12 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Feature Three</h3><p class='text-gray-600'>Description of the third feature that highlights its benefits and value.</p></div></div></div></section>
```

### Example 2: Four Benefits Cards with Images

**When To Use**: Ideal for showcasing multiple benefits with accompanying images, suitable for product landing pages or service highlights.

**Why It Works**: The combination of images and text creates an engaging visual experience. The grid layout ensures that content is well-organized, while the consistent padding and margins maintain a clean look.

**Tailwind Notes**:
- grid-cols-1 md:grid-cols-4 for responsive grid layout that adapts to different screen sizes.
- rounded-lg for card corners to soften the look.
- hover:shadow-xl to create an interactive effect on hover.
- text-gray-700 for better readability against the card backgrounds.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-10'>Our Benefits</h2><div class='grid grid-cols-1 md:grid-cols-4 gap-6'><div class='bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'><img class='w-full h-48 object-cover' src='benefit1.jpg' alt='Benefit 1'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Benefit One</h3><p class='text-gray-700'>Short description of the first benefit with a focus on its impact.</p></div></div><div class='bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'><img class='w-full h-48 object-cover' src='benefit2.jpg' alt='Benefit 2'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Benefit Two</h3><p class='text-gray-700'>Short description of the second benefit with a focus on its impact.</p></div></div><div class='bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'><img class='w-full h-48 object-cover' src='benefit3.jpg' alt='Benefit 3'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Benefit Three</h3><p class='text-gray-700'>Short description of the third benefit with a focus on its impact.</p></div></div><div class='bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'><img class='w-full h-48 object-cover' src='benefit4.jpg' alt='Benefit 4'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Benefit Four</h3><p class='text-gray-700'>Short description of the fourth benefit with a focus on its impact.</p></div></div></div></div></section>
```

## `benefits` / `checklist`

### Example 1: Simple Benefits Checklist

**When To Use**: Use this when you want to highlight key benefits in a straightforward and easy-to-read format.

**Why It Works**: The clear layout and contrasting colors draw attention to each benefit, while the checklist format makes it easy for users to scan and understand the value proposition quickly.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Incorporates ample padding and margin for better readability.
- Employs color contrast for accessibility.

```html
<section class="bg-white py-12 px-6 md:px-12"><div class="max-w-5xl mx-auto"><h2 class="text-3xl font-bold text-center mb-8">Why Choose Us?</h2><ul class="space-y-4"><li class="flex items-start space-x-3"><span class="flex-shrink-0 h-6 w-6 text-green-500"><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19l-7-7 1.5-1.5L9 16l12-12 1.5 1.5z"/></svg></span><span class="text-lg">High-Quality Products</span></li><li class="flex items-start space-x-3"><span class="flex-shrink-0 h-6 w-6 text-green-500"><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19l-7-7 1.5-1.5L9 16l12-12 1.5 1.5z"/></svg></span><span class="text-lg">Exceptional Customer Service</span></li><li class="flex items-start space-x-3"><span class="flex-shrink-0 h-6 w-6 text-green-500"><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19l-7-7 1.5-1.5L9 16l12-12 1.5 1.5z"/></svg></span><span class="text-lg">Fast Shipping</span></li></ul></div></section>
```

### Example 2: Detailed Benefits Checklist with Icons

**When To Use**: Ideal for showcasing benefits with accompanying icons to visually reinforce the message.

**Why It Works**: The use of icons enhances visual learning, while the grid layout ensures that the section is organized and responsive across devices.

**Tailwind Notes**:
- Employs grid layout for a balanced look.
- Icons provide visual cues that enhance comprehension.
- Responsive design ensures accessibility on mobile devices.

```html
<section class="bg-gray-50 py-16"><div class="max-w-6xl mx-auto"><h2 class="text-4xl font-extrabold text-center mb-12">Our Benefits</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><div class="bg-white p-6 rounded-lg shadow-md"><div class="flex items-center mb-4"><img src="/path/to/icon1.svg" alt="Benefit 1" class="h-8 w-8 mr-3"><h3 class="text-xl font-semibold">Benefit One</h3></div><p class="text-gray-600">Description of the first benefit that explains why it matters.</p></div><div class="bg-white p-6 rounded-lg shadow-md"><div class="flex items-center mb-4"><img src="/path/to/icon2.svg" alt="Benefit 2" class="h-8 w-8 mr-3"><h3 class="text-xl font-semibold">Benefit Two</h3></div><p class="text-gray-600">Description of the second benefit that explains why it matters.</p></div><div class="bg-white p-6 rounded-lg shadow-md"><div class="flex items-center mb-4"><img src="/path/to/icon3.svg" alt="Benefit 3" class="h-8 w-8 mr-3"><h3 class="text-xl font-semibold">Benefit Three</h3></div><p class="text-gray-600">Description of the third benefit that explains why it matters.</p></div></div></div></section>
```

## `benefits` / `contrast-bands`

### Example 1: Feature Highlights

**When To Use**: When showcasing key benefits or features in a visually distinct manner that stands out against the background.

**Why It Works**: The alternating background colors create visual interest and help separate each benefit, making it easier for users to scan the content. The use of icons enhances comprehension and adds a modern touch.

**Tailwind Notes**:
- Utilizes alternating background colors for clear separation.
- Incorporates icons for visual representation of benefits.
- Responsive design ensures readability on all devices.

```html
<section class="py-12 bg-gray-100">
  <div class="container mx-auto">
    <h2 class="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg>
          <h3 class="text-xl font-semibold">High Quality</h3>
        </div>
        <p class="text-gray-600">We ensure the highest quality standards in all our products.</p>
      </div>
      <div class="bg-gray-200 p-6 rounded-lg shadow-lg">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg>
          <h3 class="text-xl font-semibold">Affordable Pricing</h3>
        </div>
        <p class="text-gray-600">Get the best value for your money with our competitive pricing.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg>
          <h3 class="text-xl font-semibold">24/7 Support</h3>
        </div>
        <p class="text-gray-600">Our dedicated support team is here to help you anytime.</p>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Customer Benefits Overview

**When To Use**: Ideal for landing pages that need to communicate multiple benefits clearly and effectively, appealing to potential customers.

**Why It Works**: The use of contrasting background colors helps to create a clear visual hierarchy, while the spacious layout ensures that each benefit stands out, making it easy for users to digest the information. The call-to-action button is prominent and encourages user interaction.

**Tailwind Notes**:
- Contrast between background colors helps in visual segmentation.
- Generous padding and margin create a clean layout.
- CTA button styled for emphasis and visibility.

```html
<section class="py-16 bg-gray-50">
  <div class="container mx-auto">
    <h2 class="text-4xl font-bold text-center mb-10">Benefits of Our Service</h2>
    <div class="flex flex-col md:flex-row md:space-x-4">
      <div class="bg-blue-500 text-white p-8 rounded-lg flex-1 mb-4 md:mb-0">
        <h3 class="text-2xl font-semibold">Enhanced Productivity</h3>
        <p class="mt-2">Our tools streamline your workflow, allowing you to focus on what matters most.</p>
      </div>
      <div class="bg-white shadow-lg rounded-lg flex-1 mb-4 md:mb-0">
        <h3 class="text-2xl font-semibold text-gray-800">User-Friendly Interface</h3>
        <p class="mt-2 text-gray-600">Navigate effortlessly with our intuitive design.</p>
      </div>
      <div class="bg-blue-500 text-white p-8 rounded-lg flex-1">
        <h3 class="text-2xl font-semibold">Cost Effective</h3>
        <p class="mt-2">Save money while achieving more with our affordable plans.</p>
      </div>
    </div>
    <div class="mt-8 text-center">
      <a href="#" class="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200">Get Started</a>
    </div>
  </div>
</section>
```

## `benefits` / `before-after-benefits`

### Example 1: Transformation Showcase

**When To Use**: Use this layout to highlight the transformation your product offers, showing clear before-and-after scenarios.

**Why It Works**: The side-by-side layout emphasizes the contrast between the before and after states, making the benefits of your product visually clear and compelling. The use of colors and spacing guides the viewer's focus.

**Tailwind Notes**:
- Flexbox for side-by-side layout
- Consistent spacing for visual hierarchy
- Bold typography for emphasis
- Color contrast for accessibility

```html
<section class="py-16 bg-gray-50">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">See the Difference</h2>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-1 bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-4">Before</h3>
        <p class="text-gray-700">Struggling with outdated processes and inefficiency.</p>
      </div>
      <div class="flex-1 bg-green-500 p-6 rounded-lg shadow-lg text-white">
        <h3 class="text-xl font-semibold mb-4">After</h3>
        <p class="text-gray-200">Streamlined workflows and increased productivity.</p>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Customer Success Stories

**When To Use**: Ideal for showcasing real-life examples of how your service has transformed customer experiences, making it relatable.

**Why It Works**: This layout uses cards to present individual stories, making it easy for users to digest information. The consistent card design maintains a clean look while the alternating colors create visual interest.

**Tailwind Notes**:
- Grid layout for responsive card display
- Hover effects for interactivity
- Clear CTA buttons for engagement

```html
<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Real Transformations</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-xl font-semibold mb-2">Before</h3>
        <p class="text-gray-700 mb-4">Limited visibility into project progress.</p>
        <h3 class="text-xl font-semibold mb-2">After</h3>
        <p class="text-gray-700">Complete transparency and real-time updates.</p>
        <a href="#" class="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</a>
      </div>
      <div class="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-xl font-semibold mb-2">Before</h3>
        <p class="text-gray-700 mb-4">High operational costs.</p>
        <h3 class="text-xl font-semibold mb-2">After</h3>
        <p class="text-gray-700">Reduced costs through automation.</p>
        <a href="#" class="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</a>
      </div>
      <div class="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-xl font-semibold mb-2">Before</h3>
        <p class="text-gray-700 mb-4">Inconsistent customer feedback.</p>
        <h3 class="text-xl font-semibold mb-2">After</h3>
        <p class="text-gray-700">Consistent, actionable insights.</p>
        <a href="#" class="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</a>
      </div>
    </div>
  </div>
</section>
```

## `why-us` / `pillars`

### Example 1: Three Pillars of Trust

**When To Use**: When you want to highlight key values or principles that differentiate your brand.

**Why It Works**: This layout uses a grid system to create a clean, organized presentation of each pillar, enhancing readability and visual appeal. The use of contrasting colors and ample whitespace draws attention to each point, making it easy for users to digest information quickly.

**Tailwind Notes**:
- Grid layout for responsive design using 'grid grid-cols-1 md:grid-cols-3 gap-8'.
- Consistent spacing with 'p-6' for card padding and 'mb-6' for margin between items.
- Emphasis on CTAs with 'bg-blue-600 text-white' for buttons, ensuring they stand out.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto text-center'><h2 class='text-3xl font-bold mb-6'>Our Pillars of Trust</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-white p-6 rounded-lg shadow-lg'><h3 class='text-xl font-semibold mb-2'>Integrity</h3><p class='text-gray-700 mb-4'>We uphold the highest standards of integrity in all our actions.</p><a href='#' class='inline-block bg-blue-600 text-white px-4 py-2 rounded'>Learn More</a></div><div class='bg-white p-6 rounded-lg shadow-lg'><h3 class='text-xl font-semibold mb-2'>Innovation</h3><p class='text-gray-700 mb-4'>We strive to innovate and improve our services continuously.</p><a href='#' class='inline-block bg-blue-600 text-white px-4 py-2 rounded'>Learn More</a></div><div class='bg-white p-6 rounded-lg shadow-lg'><h3 class='text-xl font-semibold mb-2'>Customer Focus</h3><p class='text-gray-700 mb-4'>Our customers are at the heart of everything we do.</p><a href='#' class='inline-block bg-blue-600 text-white px-4 py-2 rounded'>Learn More</a></div></div></div></section>
```

### Example 2: Core Values Showcase

**When To Use**: Ideal for emphasizing foundational values that resonate with your audience, especially in a corporate or service-oriented context.

**Why It Works**: The use of a flex layout allows for a dynamic arrangement of pillars that adapt to screen sizes. The alternating background colors create visual interest, while the icons enhance comprehension and engagement with the content.

**Tailwind Notes**:
- Flexbox for layout with 'flex flex-col md:flex-row' for responsive behavior.
- Alternating background colors using 'bg-white' and 'bg-gray-100' for visual separation.
- Icons added for visual context using 'h-10 w-10 text-blue-600' to maintain brand consistency.

```html
<section class='py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Core Values</h2><div class='flex flex-col md:flex-row'><div class='flex-1 bg-white p-6 rounded-lg shadow-lg mb-4 md:mb-0 md:mr-4'><div class='flex items-center mb-4'><svg class='h-10 w-10 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4' /></svg><h3 class='text-xl font-semibold'>Transparency</h3></div><p class='text-gray-700'>We believe in open communication and transparency with our clients.</p></div><div class='flex-1 bg-gray-100 p-6 rounded-lg shadow-lg mb-4 md:mb-0 md:mr-4'><div class='flex items-center mb-4'><svg class='h-10 w-10 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4' /></svg><h3 class='text-xl font-semibold'>Quality</h3></div><p class='text-gray-700'>We are committed to delivering high-quality products and services.</p></div><div class='flex-1 bg-white p-6 rounded-lg shadow-lg'><div class='flex items-center mb-4'><svg class='h-10 w-10 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4' /></svg><h3 class='text-xl font-semibold'>Community</h3></div><p class='text-gray-700'>We actively contribute to the communities we serve.</p></div></div></div></section>
```

## `why-us` / `comparison`

### Example 1: Feature Comparison Table

**When To Use**: When showcasing key features of your product against competitors.

**Why It Works**: This layout provides a clear visual hierarchy, allowing users to quickly scan and compare features. The use of contrasting colors emphasizes the advantages of your product.

**Tailwind Notes**:
- Flexbox is used for responsive layout.
- Contrast is created using background and text colors.
- Hover effects on CTA buttons enhance interactivity.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Why Choose Us?</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Our Product</h3><ul class='space-y-2'><li class='flex items-center'><span class='text-green-500 mr-2'>✔️</span>Feature A</li><li class='flex items-center'><span class='text-green-500 mr-2'>✔️</span>Feature B</li><li class='flex items-center'><span class='text-green-500 mr-2'>✔️</span>Feature C</li></ul><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Competitor 1</h3><ul class='space-y-2'><li class='flex items-center'><span class='text-red-500 mr-2'>❌</span>Feature A</li><li class='flex items-center'><span class='text-red-500 mr-2'>✔️</span>Feature B</li><li class='flex items-center'><span class='text-red-500 mr-2'>❌</span>Feature C</li></ul><a href='#' class='mt-4 inline-block bg-gray-300 text-gray-800 py-2 px-4 rounded-lg'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Competitor 2</h3><ul class='space-y-2'><li class='flex items-center'><span class='text-red-500 mr-2'>❌</span>Feature A</li><li class='flex items-center'><span class='text-red-500 mr-2'>❌</span>Feature B</li><li class='flex items-center'><span class='text-red-500 mr-2'>✔️</span>Feature C</li></ul><a href='#' class='mt-4 inline-block bg-gray-300 text-gray-800 py-2 px-4 rounded-lg'>Learn More</a></div></div></div></section>
```

### Example 2: Comparison Cards with Testimonials

**When To Use**: When you want to illustrate product benefits while incorporating social proof.

**Why It Works**: Combining features with testimonials creates a compelling narrative. The card layout allows for easy scanning, and testimonials add credibility.

**Tailwind Notes**:
- Cards are styled with shadows for depth.
- Testimonial quotes are emphasized with italic text.
- Responsive design ensures usability on all devices.

```html
<section class='py-12 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Why We Stand Out</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-gray-100 shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Feature 1</h3><p class='mb-4'>Our product offers the best feature set in the market.</p><blockquote class='italic text-gray-600'>“This feature changed my life!” - Happy Customer</blockquote></div><div class='bg-gray-100 shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Feature 2</h3><p class='mb-4'>Experience unparalleled performance with our solutions.</p><blockquote class='italic text-gray-600'>“I can't imagine going back to the old way!” - Satisfied User</blockquote></div><div class='bg-gray-100 shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Feature 3</h3><p class='mb-4'>Join thousands who trust us for their needs.</p><blockquote class='italic text-gray-600'>“Absolutely the best!” - Loyal Client</blockquote></div></div></div></section>
```

## `why-us` / `story-led`

### Example 1: Customer Success Stories

**When To Use**: When showcasing testimonials or narratives from satisfied customers to build trust and credibility.

**Why It Works**: Utilizes a card layout to present individual stories, enhancing readability and engagement. The use of contrasting colors for CTAs draws attention and encourages action.

**Tailwind Notes**:
- Flexbox layout for responsive card arrangement.
- Consistent padding and margin for visual balance.
- Text colors and backgrounds provide clear hierarchy.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>What Our Customers Say</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-2'>Jane Doe</h3><p class='text-gray-700 mb-4'>"This product changed my life! I can't imagine going back to how things were before."</p><a href='#' class='inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600'>Read More</a></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-2'>John Smith</h3><p class='text-gray-700 mb-4'>"Exceptional service and quality. Highly recommend to everyone!"</p><a href='#' class='inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600'>Read More</a></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-2'>Alice Johnson</h3><p class='text-gray-700 mb-4'>"A fantastic experience from start to finish. Will definitely be back!"</p><a href='#' class='inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600'>Read More</a></div></div></div></section>
```

### Example 2: Our Journey

**When To Use**: To narrate the company's evolution and milestones, fostering a connection with potential customers.

**Why It Works**: The timeline layout provides a clear visual progression of the story, while alternating background colors enhance readability and engagement. The emphasis on key milestones with larger typography captures attention.

**Tailwind Notes**:
- Use of flex and grid for responsive timeline layout.
- Alternating background colors for visual interest.
- Emphasis on key dates and events with larger font sizes.

```html
<section class='py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Journey</h2><div class='space-y-8'><div class='bg-gray-100 p-6 rounded-lg'><h3 class='text-2xl font-semibold'>2015: The Beginning</h3><p class='text-gray-700'>Founded with a mission to innovate and inspire.</p></div><div class='bg-white p-6 rounded-lg'><h3 class='text-2xl font-semibold'>2018: Major Breakthrough</h3><p class='text-gray-700'>Launched our flagship product, receiving rave reviews.</p></div><div class='bg-gray-100 p-6 rounded-lg'><h3 class='text-2xl font-semibold'>2021: Expanding Horizons</h3><p class='text-gray-700'>Opened new offices and expanded our team.</p></div></div></div></section>
```

## `why-us` / `stacked`

### Example 1: Why Choose Us - Feature Highlights

**When To Use**: Use this layout to present key features or benefits of your service or product in a visually appealing way.

**Why It Works**: The stacked layout with clear headings and icons helps to create a hierarchy that guides the user's attention. The use of contrasting colors for CTAs ensures they stand out, encouraging user interaction.

**Tailwind Notes**:
- Use flexbox to align items centrally and responsively.
- Apply consistent spacing for a clean layout.
- Utilize background colors to create sections that stand out.

```html
<section class='py-12 bg-gray-50'><div class='max-w-6xl mx-auto text-center'><h2 class='text-3xl font-semibold mb-8'>Why Choose Us</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='p-6 bg-white shadow-lg rounded-lg'><h3 class='text-xl font-bold mb-4'>Feature One</h3><p class='text-gray-600 mb-4'>Description of feature one that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='p-6 bg-white shadow-lg rounded-lg'><h3 class='text-xl font-bold mb-4'>Feature Two</h3><p class='text-gray-600 mb-4'>Description of feature two that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='p-6 bg-white shadow-lg rounded-lg'><h3 class='text-xl font-bold mb-4'>Feature Three</h3><p class='text-gray-600 mb-4'>Description of feature three that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div></div></section>
```

### Example 2: Why Our Customers Love Us

**When To Use**: This layout is ideal for showcasing customer testimonials or endorsements, emphasizing trust and satisfaction.

**Why It Works**: The use of customer quotes with images creates a personal touch, while the stacked layout ensures readability. The background color differentiates this section from others, making it visually distinct.

**Tailwind Notes**:
- Incorporate rounded images for a friendly appearance.
- Use contrasting background colors to highlight testimonials.
- Ensure text is legible with appropriate font sizes and weights.

```html
<section class='py-12 bg-white'><div class='max-w-6xl mx-auto text-center'><h2 class='text-3xl font-semibold mb-8'>What Our Customers Say</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-8'><div class='p-6 bg-gray-100 rounded-lg shadow-md'><img src='customer1.jpg' alt='Customer Image' class='w-16 h-16 rounded-full mx-auto mb-4'><p class='text-gray-800 italic'>"This service has changed my life! Highly recommend!"</p><p class='text-gray-600 mt-2'>- Customer Name</p></div><div class='p-6 bg-gray-100 rounded-lg shadow-md'><img src='customer2.jpg' alt='Customer Image' class='w-16 h-16 rounded-full mx-auto mb-4'><p class='text-gray-800 italic'>"Amazing experience, great support!"</p><p class='text-gray-600 mt-2'>- Customer Name</p></div></div></div></section>
```

## `problem-solution` / `two-column`

### Example 1: Highlighting Common Pain Points

**When To Use**: When you want to address specific problems faced by your audience and present your solution clearly.

**Why It Works**: The clear separation between the problem and solution enhances readability and allows users to quickly identify their pain points and see how your product can help. The use of contrasting colors and intentional spacing creates a polished look.

**Tailwind Notes**:
- Use of flexbox for responsive two-column layout.
- Consistent padding and margin for visual balance.
- Utilization of background colors to differentiate sections.

```html
<section class='bg-gray-50 py-12'><div class='container mx-auto px-4'><div class='flex flex-col md:flex-row items-center'><div class='md:w-1/2 p-6'><h2 class='text-2xl font-bold text-gray-800 mb-4'>The Problem</h2><p class='text-gray-600'>Many businesses struggle with inefficient communication, leading to misunderstandings and lost productivity.</p></div><div class='md:w-1/2 p-6 bg-white shadow-lg rounded-lg'><h2 class='text-2xl font-bold text-gray-800 mb-4'>Our Solution</h2><p class='text-gray-600'>Our platform streamlines communication, ensuring everyone is on the same page and boosting overall efficiency.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div></div></section>
```

### Example 2: Addressing User Concerns

**When To Use**: Ideal for showcasing multiple user concerns with corresponding solutions in a visually engaging manner.

**Why It Works**: By using cards to present each problem-solution pair, the layout becomes digestible and visually appealing. The use of hover effects on the cards enhances interactivity.

**Tailwind Notes**:
- Grid layout for responsive card design.
- Hover effects for interactivity.
- Consistent use of colors for branding.

```html
<section class='py-12'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Common Problems & Solutions</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition'><h3 class='text-xl font-semibold text-gray-800'>Problem 1</h3><p class='text-gray-600'>Users often feel overwhelmed by too many options, leading to decision fatigue.</p><h4 class='font-bold text-gray-800 mt-4'>Solution:</h4><p class='text-gray-600'>Our curated recommendations simplify choices, making decision-making easy.</p></div><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition'><h3 class='text-xl font-semibold text-gray-800'>Problem 2</h3><p class='text-gray-600'>Frequent updates can confuse users and lead to frustration.</p><h4 class='font-bold text-gray-800 mt-4'>Solution:</h4><p class='text-gray-600'>We provide clear, concise updates to keep everyone informed without the clutter.</p></div></div></div></section>
```

## `problem-solution` / `stacked`

### Example 1: Problem-Solution Overview

**When To Use**: Use this layout to clearly present a problem followed by a direct solution, ideal for landing pages focused on a single product or service.

**Why It Works**: The clear separation of the problem and solution with contrasting backgrounds enhances readability and guides the user through the narrative. The use of bold typography and ample white space creates a polished look.

**Tailwind Notes**:
- Utilizes flexbox for layout control and responsiveness.
- Contrasting background colors help differentiate problem and solution sections.
- Generous padding and margin create a spacious layout.

```html
<section class='py-12 bg-white'><div class='max-w-4xl mx-auto text-center'><h2 class='text-3xl font-bold mb-4'>Are You Struggling With X?</h2><p class='text-lg text-gray-600 mb-8'>Many people face this issue, leading to frustration and inefficiency.</p></div><div class='bg-gray-100 py-8'><div class='max-w-4xl mx-auto text-center'><h3 class='text-2xl font-semibold mb-4'>Our Solution: Y</h3><p class='text-lg text-gray-600 mb-6'>Our product offers a seamless way to overcome this challenge.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition'>Learn More</a></div></div></section>
```

### Example 2: Detailed Problem-Solution Cards

**When To Use**: This format is effective for showcasing multiple problems and corresponding solutions, making it suitable for services with diverse offerings.

**Why It Works**: Using cards allows for a clean, organized presentation of information. The hover effects on cards enhance interactivity, encouraging user engagement.

**Tailwind Notes**:
- Grid layout for responsive card arrangement.
- Hover effects for cards improve user experience.
- Consistent padding and border radius for a cohesive look.

```html
<section class='py-12'><div class='max-w-6xl mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Common Challenges & Our Solutions</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition'><h3 class='text-xl font-semibold mb-2'>Problem 1</h3><p class='text-gray-600 mb-4'>Description of the problem that users face.</p><h4 class='text-lg font-semibold mb-2'>Solution:</h4><p class='text-gray-600 mb-4'>Brief explanation of how the product solves this issue.</p><a href='#' class='text-blue-600 font-semibold'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition'><h3 class='text-xl font-semibold mb-2'>Problem 2</h3><p class='text-gray-600 mb-4'>Description of another common problem.</p><h4 class='text-lg font-semibold mb-2'>Solution:</h4><p class='text-gray-600 mb-4'>How the service addresses this problem.</p><a href='#' class='text-blue-600 font-semibold'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition'><h3 class='text-xl font-semibold mb-2'>Problem 3</h3><p class='text-gray-600 mb-4'>Overview of yet another issue.</p><h4 class='text-lg font-semibold mb-2'>Solution:</h4><p class='text-gray-600 mb-4'>The solution provided by the product.</p><a href='#' class='text-blue-600 font-semibold'>Learn More</a></div></div></div></section>
```

## `problem-solution` / `problem-first`

### Example 1: Highlighting Common Pain Points

**When To Use**: Use this layout when you want to immediately address the user's pain points before presenting your solution. Ideal for landing pages targeting specific user challenges.

**Why It Works**: This layout effectively captures attention by empathizing with the user's struggles first, creating a connection before showcasing the solution. The use of contrasting colors and clear typography enhances readability and engagement.

**Tailwind Notes**:
- Utilizes a flex layout for responsive design.
- Employs contrasting background colors to differentiate between problem and solution.
- Incorporates ample padding and margin for clear visual separation.

```html
<section class="py-16 bg-gray-100">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Facing These Challenges?</h2>
    <ul class="space-y-4">
      <li class="bg-white shadow rounded-lg p-6">
        <h3 class="text-xl font-semibold text-gray-700">High Costs</h3>
        <p class="text-gray-600">Are you struggling with escalating expenses that eat into your profits?</p>
      </li>
      <li class="bg-white shadow rounded-lg p-6">
        <h3 class="text-xl font-semibold text-gray-700">Time Constraints</h3>
        <p class="text-gray-600">Is your team overwhelmed with tight deadlines and limited resources?</p>
      </li>
    </ul>
    <div class="mt-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Our Solution</h2>
      <p class="text-gray-600 mb-6">Discover how we can help you overcome these challenges with our tailored services.</p>
      <a href="#" class="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200">Learn More</a>
    </div>
  </div>
</section>
```

### Example 2: Empathy-Driven Approach

**When To Use**: This design is suitable for services that require a deep understanding of user pain points, particularly in competitive markets where differentiation is key.

**Why It Works**: By prioritizing user problems, this layout builds trust and positions the brand as a knowledgeable partner. The use of icons adds visual interest and aids in quick comprehension of the issues.

**Tailwind Notes**:
- Uses a grid layout for responsive design, ensuring accessibility on all devices.
- Incorporates icons to visually represent problems, enhancing engagement.
- Utilizes a call-to-action button that stands out with color and hover effects.

```html
<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Are You Experiencing These Issues?</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-gray-100 p-6 rounded-lg shadow">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <h3 class="text-xl font-semibold">Lack of Clarity</h3>
        </div>
        <p class="text-gray-600">Is your team unclear about project goals and objectives?</p>
      </div>
      <div class="bg-gray-100 p-6 rounded-lg shadow">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <h3 class="text-xl font-semibold">Inefficient Processes</h3>
        </div>
        <p class="text-gray-600">Are your workflows causing delays and frustration?</p>
      </div>
      <div class="bg-gray-100 p-6 rounded-lg shadow">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <h3 class="text-xl font-semibold">Communication Gaps</h3>
        </div>
        <p class="text-gray-600">Is your team struggling to communicate effectively?</p>
      </div>
    </div>
    <div class="mt-12 text-center">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Our Tailored Solutions</h2>
      <p class="text-gray-600 mb-6">Let us help you tackle these challenges head-on.</p>
      <a href="#" class="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200">Get Started</a>
    </div>
  </div>
</section>
```

## `problem-solution` / `journey-shift`

### Example 1: Transform Your Workflow

**When To Use**: Use this section to highlight a common problem in workflows and present your solution as a transformative journey.

**Why It Works**: The layout uses a clear visual hierarchy with contrasting colors to emphasize the problem and solution. The CTA is prominent and encourages user engagement.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs background colors to differentiate sections.
- Margin and padding are used strategically for spacing.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto flex flex-col md:flex-row items-center justify-between'><div class='md:w-1/2 mb-8 md:mb-0'><h2 class='text-3xl font-bold text-gray-800'>Is Your Workflow Slowing You Down?</h2><p class='mt-4 text-gray-600'>Many teams struggle with inefficient processes that hinder productivity.</p></div><div class='md:w-1/2 flex flex-col items-center'><h3 class='text-2xl font-semibold text-blue-600'>Our Solution: Streamlined Project Management</h3><p class='mt-4 text-gray-600'>Experience a seamless transition to a more efficient workflow.</p><a href='#' class='mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200'>Start Your Journey</a></div></div></section>
```

### Example 2: Conquer Customer Support Challenges

**When To Use**: Ideal for showcasing how your service can resolve common customer support issues, guiding users towards a better experience.

**Why It Works**: This example uses a card layout for visual clarity, making it easy to digest information. The use of contrasting colors highlights the CTA, ensuring it stands out.

**Tailwind Notes**:
- Grid layout for easy readability.
- Color contrast for emphasis on key messages.
- Responsive design for mobile and desktop views.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center text-gray-800 mb-8'>Facing Customer Support Issues?</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-8'><div class='p-6 border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-200'><h3 class='text-xl font-semibold text-gray-800'>Problem: Long Response Times</h3><p class='mt-2 text-gray-600'>Customers often wait too long for support, leading to frustration.</p></div><div class='p-6 border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-200'><h3 class='text-xl font-semibold text-gray-800'>Solution: Instant Chat Support</h3><p class='mt-2 text-gray-600'>Our live chat feature connects customers with agents instantly.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg'>Learn More</a></div></div></div></section>
```

## `use-cases` / `grid`

### Example 1: Grid of Use Cases for Product Features

**When To Use**: Use this layout to showcase multiple use cases of a product, highlighting how it can benefit different user segments.

**Why It Works**: The grid layout allows for a visually appealing arrangement of diverse use cases, making it easy for users to scan and find relevant information. The use of contrasting backgrounds and ample spacing enhances readability and focus on each use case.

**Tailwind Notes**:
- Flexibly adjusts to various screen sizes with responsive classes.
- Utilizes consistent spacing for a clean and organized appearance.
- Emphasizes CTAs with standout colors and hover effects.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Use Cases</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold mb-2'>For Small Businesses</h3><p class='text-gray-700 mb-4'>Streamline operations and enhance customer engagement.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold mb-2'>For Freelancers</h3><p class='text-gray-700 mb-4'>Manage projects and track time efficiently.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold mb-2'>For Enterprises</h3><p class='text-gray-700 mb-4'>Integrate solutions across departments seamlessly.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div></div></section>
```

### Example 2: Grid Display of Customer Success Stories

**When To Use**: Ideal for showcasing customer testimonials or success stories in a visually engaging way.

**Why It Works**: The grid format allows for easy comparison of different success stories. Each card is designed with consistent styling, ensuring that the focus remains on the content while still being visually distinct.

**Tailwind Notes**:
- Cards are designed with shadows and rounded corners for a modern look.
- Responsive grid adapts to different screen sizes for optimal viewing.
- Clear hierarchy with headings and body text improves readability.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Customer Success Stories</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold mb-2'>Jane D.</h3><p class='text-gray-600 mb-4'>"This product transformed the way we operate! Our efficiency has increased by 50%."</p><a href='#' class='inline-block text-blue-600 hover:underline'>Read More</a></div><div class='bg-white rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold mb-2'>John S.</h3><p class='text-gray-600 mb-4'>"The customer support is outstanding, and the product is easy to use!"</p><a href='#' class='inline-block text-blue-600 hover:underline'>Read More</a></div><div class='bg-white rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold mb-2'>Emily R.</h3><p class='text-gray-600 mb-4'>"I can't imagine running my business without it. Highly recommended!"</p><a href='#' class='inline-block text-blue-600 hover:underline'>Read More</a></div></div></div></section>
```

## `use-cases` / `tabs`

### Example 1: Product Features Tabs

**When To Use**: Use this layout when showcasing different features of a product that users can explore interactively.

**Why It Works**: The tabbed interface allows users to quickly switch between features without leaving the page, enhancing engagement. The clear hierarchy and spacing improve readability, while the contrasting colors draw attention to the active tab.

**Tailwind Notes**:
- Use flexbox for layout and alignment.
- Apply rounded corners and shadows for a polished look.
- Utilize responsive classes to ensure usability on all devices.

```html
<section class='py-12 bg-gray-50'>
  <div class='max-w-4xl mx-auto'>
    <h2 class='text-3xl font-bold text-center mb-6'>Explore Our Features</h2>
    <div class='flex space-x-4 mb-6'>
      <button class='flex-1 py-2 text-lg font-semibold text-gray-700 bg-white rounded-lg shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'>Feature 1</button>
      <button class='flex-1 py-2 text-lg font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'>Feature 2</button>
      <button class='flex-1 py-2 text-lg font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'>Feature 3</button>
    </div>
    <div class='p-6 bg-white rounded-lg shadow'>
      <p class='text-gray-600'>Details about Feature 1 go here. This section provides an overview and benefits of the feature.</p>
    </div>
  </div>
</section>
```

### Example 2: Service Comparison Tabs

**When To Use**: Ideal for comparing different services or plans side by side, allowing users to make informed decisions.

**Why It Works**: The tabbed layout organizes information clearly, making it easy for users to digest and compare options. The use of contrasting colors for selected and unselected states enhances usability.

**Tailwind Notes**:
- Incorporate hover states for better interactivity.
- Ensure sufficient padding for touch targets on mobile devices.
- Use responsive typography for better readability on smaller screens.

```html
<section class='py-12 bg-white'>
  <div class='max-w-5xl mx-auto'>
    <h2 class='text-4xl font-bold text-center mb-8'>Choose Your Plan</h2>
    <div class='flex space-x-2 mb-6'>
      <button class='flex-1 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none'>Basic</button>
      <button class='flex-1 py-3 text-lg font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none'>Standard</button>
      <button class='flex-1 py-3 text-lg font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none'>Premium</button>
    </div>
    <div class='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <div class='p-6 bg-gray-100 rounded-lg shadow'>
        <h3 class='text-xl font-semibold'>Basic Plan</h3>
        <p class='mt-2 text-gray-600'>Includes basic features and support.</p>
      </div>
      <div class='p-6 bg-white rounded-lg shadow'>
        <h3 class='text-xl font-semibold'>Standard Plan</h3>
        <p class='mt-2 text-gray-600'>Includes all basic features plus additional support.</p>
      </div>
      <div class='p-6 bg-gray-100 rounded-lg shadow'>
        <h3 class='text-xl font-semibold'>Premium Plan</h3>
        <p class='mt-2 text-gray-600'>All features included with priority support.</p>
      </div>
    </div>
  </div>
</section>
```

## `use-cases` / `cards`

### Example 1: Feature Highlight Cards

**When To Use**: Use this layout to showcase key features or benefits of a product in a visually engaging manner.

**Why It Works**: The card layout allows for clear separation of content, making it easy for users to digest information. The use of hover effects and shadows creates a polished look that enhances user interaction.

**Tailwind Notes**:
- Utilizes grid layout for responsive design.
- Hover effects improve interactivity.
- Consistent padding and margin create a balanced layout.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Key Features</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Feature One</h3><p class='text-gray-700 mb-4'>Description of the first feature goes here. It highlights the benefits effectively.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Feature Two</h3><p class='text-gray-700 mb-4'>Description of the second feature goes here. It highlights the benefits effectively.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Feature Three</h3><p class='text-gray-700 mb-4'>Description of the third feature goes here. It highlights the benefits effectively.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div></div></section>
```

### Example 2: Customer Use Cases

**When To Use**: Ideal for displaying real-world applications of your product, helping potential customers visualize its value.

**Why It Works**: This design uses a card layout with images and testimonials, which adds authenticity and visual appeal. The use of varying colors for the cards helps create a dynamic and engaging experience.

**Tailwind Notes**:
- Utilizes a responsive grid layout.
- Images enhance visual storytelling.
- Color differentiation adds interest.

```html
<section class='py-12 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>How Our Customers Use Us</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-blue-100 rounded-lg p-6'><img src='customer1.jpg' alt='Customer Use Case' class='mb-4 rounded-lg'><h3 class='text-xl font-semibold mb-2'>Use Case One</h3><p class='text-gray-600'>This is a brief description of how the customer uses the product.</p></div><div class='bg-green-100 rounded-lg p-6'><img src='customer2.jpg' alt='Customer Use Case' class='mb-4 rounded-lg'><h3 class='text-xl font-semibold mb-2'>Use Case Two</h3><p class='text-gray-600'>This is a brief description of how the customer uses the product.</p></div><div class='bg-yellow-100 rounded-lg p-6'><img src='customer3.jpg' alt='Customer Use Case' class='mb-4 rounded-lg'><h3 class='text-xl font-semibold mb-2'>Use Case Three</h3><p class='text-gray-600'>This is a brief description of how the customer uses the product.</p></div></div></div></section>
```

## `use-cases` / `industry-columns`

### Example 1: Industry Applications Showcase

**When To Use**: When you want to highlight different industries your product serves, providing a clear visual structure for each use case.

**Why It Works**: This layout uses a grid system that allows for easy scanning of information. The use of contrasting colors and ample whitespace makes each industry stand out, while the call-to-action buttons are prominent and encourage engagement.

**Tailwind Notes**:
- Grid layout ensures responsiveness and clear hierarchy.
- Use of shadow and rounded corners on cards adds depth and polish.
- Consistent spacing between elements enhances readability.

```html
<section class="py-12 bg-gray-100"><div class="container mx-auto"><h2 class="text-3xl font-bold text-center mb-8">Explore Our Industry Solutions</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="bg-white rounded-lg shadow-lg p-6"><h3 class="text-xl font-semibold mb-4">Healthcare</h3><p class="text-gray-700 mb-4">Transform patient care with our innovative solutions.</p><a href="#" class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</a></div><div class="bg-white rounded-lg shadow-lg p-6"><h3 class="text-xl font-semibold mb-4">Finance</h3><p class="text-gray-700 mb-4">Optimize your financial operations with our tools.</p><a href="#" class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</a></div><div class="bg-white rounded-lg shadow-lg p-6"><h3 class="text-xl font-semibold mb-4">Education</h3><p class="text-gray-700 mb-4">Enhance learning experiences with our platform.</p><a href="#" class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Learn More</a></div></div></div></section>
```

### Example 2: Diverse Industry Solutions

**When To Use**: When showcasing multiple sectors in a visually appealing way, focusing on unique selling points for each.

**Why It Works**: The use of background colors and icons for each column creates visual interest and aids in quick identification of each industry. The layout is responsive, ensuring usability across devices, while the CTA buttons are designed to stand out.

**Tailwind Notes**:
- Background colors differentiate sections, enhancing visual hierarchy.
- Icons paired with text improve recognition and engagement.
- Responsive design adapts to various screen sizes seamlessly.

```html
<section class="py-12"><div class="container mx-auto"><h2 class="text-3xl font-bold text-center mb-8">Our Industries</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"><div class="bg-blue-50 rounded-lg p-6 flex flex-col items-center"><div class="mb-4"><svg class="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg></div><h3 class="text-xl font-semibold mb-2">Retail</h3><p class="text-gray-600 mb-4">Streamline your operations and enhance customer experience.</p><a href="#" class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Discover More</a></div><div class="bg-blue-50 rounded-lg p-6 flex flex-col items-center"><div class="mb-4"><svg class="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg></div><h3 class="text-xl font-semibold mb-2">Manufacturing</h3><p class="text-gray-600 mb-4">Innovate your production processes with our technology.</p><a href="#" class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Discover More</a></div><div class="bg-blue-50 rounded-lg p-6 flex flex-col items-center"><div class="mb-4"><svg class="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg></div><h3 class="text-xl font-semibold mb-2">Technology</h3><p class="text-gray-600 mb-4">Empower your business with cutting-edge solutions.</p><a href="#" class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Discover More</a></div><div class="bg-blue-50 rounded-lg p-6 flex flex-col items-center"><div class="mb-4"><svg class="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg></div><h3 class="text-xl font-semibold mb-2">Logistics</h3><p class="text-gray-600 mb-4">Optimize your supply chain with our solutions.</p><a href="#" class="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Discover More</a></div></div></div></section>
```

## `services` / `cards`

### Example 1: Three-Column Service Cards

**When To Use**: When showcasing a small set of services with equal importance, allowing for a balanced layout on larger screens.

**Why It Works**: This layout effectively utilizes space, providing clear visual separation between services. The use of hover effects adds interactivity, while the CTA buttons are prominent, encouraging user engagement.

**Tailwind Notes**:
- Flexbox layout for responsive design.
- Consistent padding and margin for uniformity.
- Hover effects enhance user experience.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Services</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Service One</h3><p class='text-gray-600 mb-4'>Description of service one that highlights its benefits and features.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Service Two</h3><p class='text-gray-600 mb-4'>Description of service two that highlights its benefits and features.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Service Three</h3><p class='text-gray-600 mb-4'>Description of service three that highlights its benefits and features.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div></div></section>
```

### Example 2: Vertical Service Cards with Icons

**When To Use**: When you want to emphasize specific features of each service using icons, making the section visually engaging and informative.

**Why It Works**: The vertical layout with icons allows for quick visual recognition of services. The use of contrasting colors for the icons and CTAs makes them stand out, while the consistent card design ensures a cohesive look.

**Tailwind Notes**:
- Icons add visual interest and clarity.
- Consistent card height maintains alignment.
- Color contrast improves accessibility.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Services</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-gray-100 shadow-md rounded-lg p-6 flex flex-col items-center'><div class='text-blue-600 text-4xl mb-4'><i class='fas fa-cog'></i></div><h3 class='text-xl font-semibold mb-2'>Service One</h3><p class='text-gray-600 mb-4'>Description of service one that highlights its benefits and features.</p><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-gray-100 shadow-md rounded-lg p-6 flex flex-col items-center'><div class='text-blue-600 text-4xl mb-4'><i class='fas fa-bolt'></i></div><h3 class='text-xl font-semibold mb-2'>Service Two</h3><p class='text-gray-600 mb-4'>Description of service two that highlights its benefits and features.</p><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-gray-100 shadow-md rounded-lg p-6 flex flex-col items-center'><div class='text-blue-600 text-4xl mb-4'><i class='fas fa-shield-alt'></i></div><h3 class='text-xl font-semibold mb-2'>Service Three</h3><p class='text-gray-600 mb-4'>Description of service three that highlights its benefits and features.</p><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div></div></section>
```

## `services` / `image-cards`

### Example 1: Three-Column Image Cards

**When To Use**: Use this layout for showcasing multiple services with images, ideal for a landing page.

**Why It Works**: The three-column layout provides a balanced visual hierarchy, allowing users to quickly scan through services. The use of hover effects and clear CTAs enhances interactivity.

**Tailwind Notes**:
- Utilizes a responsive grid layout for adaptability across devices.
- Hover effects on cards encourage engagement.
- Consistent spacing and typography create a polished look.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Services</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-105'><img src='service1.jpg' alt='Service 1' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Service One</h3><p class='text-gray-600 mb-4'>Brief description of service one that highlights its benefits.</p><a href='#' class='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>Learn More</a></div></div><div class='bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-105'><img src='service2.jpg' alt='Service 2' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Service Two</h3><p class='text-gray-600 mb-4'>Brief description of service two that highlights its benefits.</p><a href='#' class='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>Learn More</a></div></div><div class='bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-105'><img src='service3.jpg' alt='Service 3' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Service Three</h3><p class='text-gray-600 mb-4'>Brief description of service three that highlights its benefits.</p><a href='#' class='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>Learn More</a></div></div></div></div></section>
```

### Example 2: Single Large Image Card with Focused CTA

**When To Use**: Ideal for highlighting a flagship service or promotion, drawing attention to a single offering.

**Why It Works**: The large image and prominent CTA create a focal point that captures user interest. The layout is clean and directs users to take action.

**Tailwind Notes**:
- Single-column layout emphasizes one service effectively.
- Large images enhance visual appeal and engagement.
- Strong contrast in CTA makes it stand out.

```html
<section class='py-12 bg-white'><div class='container mx-auto text-center'><h2 class='text-4xl font-bold mb-6'>Featured Service</h2><div class='relative'><img src='featured-service.jpg' alt='Featured Service' class='w-full h-64 object-cover rounded-lg shadow-lg'><div class='absolute inset-0 flex items-center justify-center'><a href='#' class='bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700'>Get Started</a></div></div><p class='mt-4 text-gray-600'>Discover the benefits of our featured service and how it can help you.</p></div></section>
```

### Example 3: Grid of Image Cards with Tags

**When To Use**: Best for displaying a diverse range of services with tags to indicate categories or features.

**Why It Works**: The grid layout with tags provides clarity and organization, allowing users to filter services based on their interests. The tags add context and improve usability.

**Tailwind Notes**:
- Responsive grid adapts to different screen sizes.
- Tags add contextual information without cluttering the design.
- Consistent card design maintains a cohesive look.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Explore Our Services</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='relative bg-white rounded-lg shadow-lg overflow-hidden'><img src='service4.jpg' alt='Service 4' class='w-full h-48 object-cover'><div class='absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-2 py-1'>Category 1</div><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Service Four</h3><p class='text-gray-600 mb-4'>Brief description of service four.</p><a href='#' class='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>Learn More</a></div></div><div class='relative bg-white rounded-lg shadow-lg overflow-hidden'><img src='service5.jpg' alt='Service 5' class='w-full h-48 object-cover'><div class='absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-2 py-1'>Category 2</div><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Service Five</h3><p class='text-gray-600 mb-4'>Brief description of service five.</p><a href='#' class='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>Learn More</a></div></div><div class='relative bg-white rounded-lg shadow-lg overflow-hidden'><img src='service6.jpg' alt='Service 6' class='w-full h-48 object-cover'><div class='absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-2 py-1'>Category 3</div><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Service Six</h3><p class='text-gray-600 mb-4'>Brief description of service six.</p><a href='#' class='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>Learn More</a></div></div></div></div></section>
```

## `services` / `alternating-rows`

### Example 1: Service Offerings with Visual Icons

**When To Use**: Use this layout when showcasing distinct services with accompanying icons to enhance visual appeal.

**Why It Works**: The alternating row design creates a clear visual separation between services, making it easy for users to scan through offerings. The use of icons adds a layer of engagement and helps convey the message quickly.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Alternating background colors enhance readability.
- Generous padding and margin create breathing space.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Services</h2><div class='space-y-8'><div class='flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-md'><div class='md:w-1/3'><img src='icon1.svg' alt='Service 1' class='w-16 h-16 mx-auto' /></div><div class='md:w-2/3 md:pl-6'><h3 class='text-xl font-semibold'>Service One</h3><p class='text-gray-700'>Description of service one that highlights its benefits and features.</p><a href='#' class='mt-4 inline-block text-blue-600 font-semibold hover:underline'>Learn More</a></div></div><div class='flex flex-col md:flex-row items-center bg-gray-100 p-6 rounded-lg shadow-md'><div class='md:w-1/3'><img src='icon2.svg' alt='Service 2' class='w-16 h-16 mx-auto' /></div><div class='md:w-2/3 md:pl-6'><h3 class='text-xl font-semibold'>Service Two</h3><p class='text-gray-700'>Description of service two that highlights its benefits and features.</p><a href='#' class='mt-4 inline-block text-blue-600 font-semibold hover:underline'>Learn More</a></div></div></div></div></section>
```

### Example 2: Service Highlights with Background Color Variation

**When To Use**: Ideal for emphasizing key services with a strong visual contrast and clear call to action.

**Why It Works**: The use of alternating background colors not only helps to differentiate each service but also guides the user's eye. The clear CTAs encourage engagement and action.

**Tailwind Notes**:
- Alternating backgrounds create a visually dynamic section.
- Text hierarchy is established through font weights and sizes.
- Responsive design ensures it looks good on all devices.

```html
<section class='py-16'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>What We Offer</h2><div class='space-y-8'><div class='bg-blue-50 p-6 rounded-lg shadow-md'><h3 class='text-xl font-semibold'>Service A</h3><p class='text-gray-700'>This service helps you achieve your goals efficiently.</p><a href='#' class='mt-4 inline-block text-blue-600 font-semibold hover:underline'>Discover More</a></div><div class='bg-white p-6 rounded-lg shadow-md'><h3 class='text-xl font-semibold'>Service B</h3><p class='text-gray-700'>Experience the best features tailored for your needs.</p><a href='#' class='mt-4 inline-block text-blue-600 font-semibold hover:underline'>Discover More</a></div><div class='bg-blue-50 p-6 rounded-lg shadow-md'><h3 class='text-xl font-semibold'>Service C</h3><p class='text-gray-700'>Join us for an innovative approach to your challenges.</p><a href='#' class='mt-4 inline-block text-blue-600 font-semibold hover:underline'>Discover More</a></div></div></div></section>
```

## `services` / `comparison`

### Example 1: Feature Comparison Table

**When To Use**: When you want to clearly show the differences between multiple service packages or products to help users make informed decisions.

**Why It Works**: The use of a table format with clear headers and contrasting colors makes it easy for users to scan and compare features at a glance. The strong call-to-action buttons encourage users to take the next step.

**Tailwind Notes**:
- Utilizes grid layout for responsive design.
- Emphasizes CTAs with background color and hover effects.
- Uses consistent spacing and typography for clarity.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Compare Our Services</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Basic Plan</h3><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><button class='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>Choose Basic</button></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Pro Plan</h3><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li><li class='mb-2'>Feature 4</li></ul><button class='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>Choose Pro</button></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Premium Plan</h3><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li><li class='mb-2'>Feature 4</li><li class='mb-2'>Feature 5</li></ul><button class='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>Choose Premium</button></div></div></div></section>
```

### Example 2: Service Comparison Cards

**When To Use**: Ideal for showcasing multiple services side by side, allowing users to easily identify the best option for their needs.

**Why It Works**: The card layout provides a visually appealing and organized way to present information. Each card has a consistent style, making it easy for users to compare features and pricing.

**Tailwind Notes**:
- Uses flexbox for responsive card alignment.
- Incorporates hover effects to enhance interactivity.
- Applies consistent padding and margins for a clean look.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-10'>Service Comparison</h2><div class='flex flex-wrap justify-center gap-6'><div class='max-w-xs bg-gray-100 rounded-lg shadow-md p-5'><h3 class='text-xl font-semibold mb-3'>Service A</h3><p class='text-gray-700 mb-4'>Description of Service A with key features.</p><ul class='mb-4'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><span class='block font-bold text-lg mb-4'>$99/month</span><button class='w-full bg-green-500 text-white py-2 rounded hover:bg-green-600'>Select Service A</button></div><div class='max-w-xs bg-gray-100 rounded-lg shadow-md p-5'><h3 class='text-xl font-semibold mb-3'>Service B</h3><p class='text-gray-700 mb-4'>Description of Service B with key features.</p><ul class='mb-4'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><span class='block font-bold text-lg mb-4'>$149/month</span><button class='w-full bg-green-500 text-white py-2 rounded hover:bg-green-600'>Select Service B</button></div><div class='max-w-xs bg-gray-100 rounded-lg shadow-md p-5'><h3 class='text-xl font-semibold mb-3'>Service C</h3><p class='text-gray-700 mb-4'>Description of Service C with key features.</p><ul class='mb-4'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><span class='block font-bold text-lg mb-4'>$199/month</span><button class='w-full bg-green-500 text-white py-2 rounded hover:bg-green-600'>Select Service C</button></div></div></div></section>
```

## `services` / `stacked-list`

### Example 1: Service Offerings

**When To Use**: Use this layout to highlight a list of services offered, with each service presented in a visually distinct card format.

**Why It Works**: The use of cards helps to break down information into digestible pieces, making it easy for users to scan through the services. The intentional spacing and contrasting colors draw attention to each service, while the clear CTA encourages user engagement.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Consistent padding and margin for visual hierarchy.
- Hover effects enhance interactivity.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Services</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'><h3 class='text-xl font-semibold mb-4'>Service One</h3><p class='text-gray-700 mb-4'>Description of Service One that highlights its benefits and features.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'><h3 class='text-xl font-semibold mb-4'>Service Two</h3><p class='text-gray-700 mb-4'>Description of Service Two that highlights its benefits and features.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'><h3 class='text-xl font-semibold mb-4'>Service Three</h3><p class='text-gray-700 mb-4'>Description of Service Three that highlights its benefits and features.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div></div></section>
```

### Example 2: Comprehensive Solutions

**When To Use**: This layout is ideal for showcasing a variety of solutions tailored to different customer needs, emphasizing clarity and accessibility.

**Why It Works**: The structured layout with ample white space allows users to focus on each service. The use of contrasting colors for the background and service cards enhances readability and visual appeal, while the consistent CTA button styling promotes action.

**Tailwind Notes**:
- Employs a responsive grid for flexibility across devices.
- Clear typography hierarchy for easy navigation.
- Subtle animations on hover provide feedback.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-4xl font-extrabold text-center mb-10'>Comprehensive Solutions</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'><div class='bg-gray-100 p-5 rounded-lg shadow-md transition-transform transform hover:scale-105'><h3 class='text-2xl font-bold mb-3'>Solution A</h3><p class='text-gray-600 mb-5'>A brief overview of Solution A that addresses specific challenges.</p><a href='#' class='bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700'>Discover More</a></div><div class='bg-gray-100 p-5 rounded-lg shadow-md transition-transform transform hover:scale-105'><h3 class='text-2xl font-bold mb-3'>Solution B</h3><p class='text-gray-600 mb-5'>A brief overview of Solution B that addresses specific challenges.</p><a href='#' class='bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700'>Discover More</a></div><div class='bg-gray-100 p-5 rounded-lg shadow-md transition-transform transform hover:scale-105'><h3 class='text-2xl font-bold mb-3'>Solution C</h3><p class='text-gray-600 mb-5'>A brief overview of Solution C that addresses specific challenges.</p><a href='#' class='bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700'>Discover More</a></div><div class='bg-gray-100 p-5 rounded-lg shadow-md transition-transform transform hover:scale-105'><h3 class='text-2xl font-bold mb-3'>Solution D</h3><p class='text-gray-600 mb-5'>A brief overview of Solution D that addresses specific challenges.</p><a href='#' class='bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700'>Discover More</a></div></div></div></section>
```

## `services` / `category-groups`

### Example 1: Service Categories Grid

**When To Use**: Use this layout to showcase different service categories in a grid format, ideal for a landing page that needs to visually emphasize the variety of services offered.

**Why It Works**: The grid layout allows for clear organization of service categories, while the use of contrasting colors and ample whitespace enhances readability and visual appeal. The prominent CTA buttons draw attention and encourage user interaction.

**Tailwind Notes**:
- Grid layout provides a responsive design that adapts to different screen sizes.
- Utilizing hover effects on cards enhances interactivity.
- Clear typography hierarchy improves content scanning.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Services</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200'><img src='service1.jpg' alt='Service 1' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Service Category 1</h3><p class='text-gray-600 mb-4'>Brief description of service category 1.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div><div class='bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200'><img src='service2.jpg' alt='Service 2' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Service Category 2</h3><p class='text-gray-600 mb-4'>Brief description of service category 2.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div><div class='bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200'><img src='service3.jpg' alt='Service 3' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Service Category 3</h3><p class='text-gray-600 mb-4'>Brief description of service category 3.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div></div></div></section>
```

### Example 2: Service Categories List with Icons

**When To Use**: This layout is effective for a service offerings section where you want to highlight key features or categories with icons, making it visually engaging and easy to scan.

**Why It Works**: Using icons alongside text creates a strong visual association, helping users quickly understand the services offered. The list format allows for easy readability, and the alternating background colors enhance differentiation between items.

**Tailwind Notes**:
- Icons provide a visual cue that enhances comprehension.
- Alternating background colors improve item distinction.
- Responsive design ensures usability on mobile devices.

```html
<section class='py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Explore Our Services</h2><ul class='space-y-6'><li class='flex items-start bg-gray-100 p-4 rounded-lg'><img src='icon1.svg' alt='Icon 1' class='w-10 h-10 mr-4'><div><h3 class='text-xl font-semibold'>Service Category 1</h3><p class='text-gray-600'>Brief description of service category 1.</p><a href='#' class='text-blue-600 hover:underline'>Learn More</a></div></li><li class='flex items-start bg-white p-4 rounded-lg'><img src='icon2.svg' alt='Icon 2' class='w-10 h-10 mr-4'><div><h3 class='text-xl font-semibold'>Service Category 2</h3><p class='text-gray-600'>Brief description of service category 2.</p><a href='#' class='text-blue-600 hover:underline'>Learn More</a></div></li><li class='flex items-start bg-gray-100 p-4 rounded-lg'><img src='icon3.svg' alt='Icon 3' class='w-10 h-10 mr-4'><div><h3 class='text-xl font-semibold'>Service Category 3</h3><p class='text-gray-600'>Brief description of service category 3.</p><a href='#' class='text-blue-600 hover:underline'>Learn More</a></div></li></ul></div></section>
```

## `packages` / `cards`

### Example 1: Three-Column Pricing Cards

**When To Use**: When you want to showcase multiple pricing plans side by side, making it easy for users to compare features and choose a plan.

**Why It Works**: The three-column layout creates a clear visual hierarchy, and the use of contrasting colors for the CTAs draws attention. Responsive design ensures usability on all devices.

**Tailwind Notes**:
- Flexbox layout for responsive columns.
- Consistent padding and margin for spacing.
- Hover effects to enhance interactivity.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Choose Your Plan</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Basic</h3><p class='text-gray-600 mb-4'>Perfect for individuals.</p><span class='text-2xl font-bold'>$10/month</span><ul class='mt-4 mb-6'><li class='py-1'>Feature 1</li><li class='py-1'>Feature 2</li><li class='py-1'>Feature 3</li></ul><button class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Get Started</button></div><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Pro</h3><p class='text-gray-600 mb-4'>Ideal for small teams.</p><span class='text-2xl font-bold'>$30/month</span><ul class='mt-4 mb-6'><li class='py-1'>Feature 1</li><li class='py-1'>Feature 2</li><li class='py-1'>Feature 3</li></ul><button class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Get Started</button></div><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Enterprise</h3><p class='text-gray-600 mb-4'>For large organizations.</p><span class='text-2xl font-bold'>$100/month</span><ul class='mt-4 mb-6'><li class='py-1'>Feature 1</li><li class='py-1'>Feature 2</li><li class='py-1'>Feature 3</li></ul><button class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Get Started</button></div></div></div></section>
```

### Example 2: Single Featured Plan Card

**When To Use**: When you want to highlight a specific plan or offer, directing user attention to a single choice.

**Why It Works**: The use of a larger card with a prominent background color and larger typography emphasizes the featured plan. The CTA is clearly defined and visually distinct.

**Tailwind Notes**:
- Maximized whitespace around the card for focus.
- Bold typography for the plan name and price.
- Background color contrast to make it stand out.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Best Value</h2><div class='flex justify-center'><div class='bg-blue-500 text-white rounded-lg shadow-lg p-8 max-w-sm text-center'><h3 class='text-2xl font-semibold mb-4'>Premium Plan</h3><p class='text-lg mb-4'>Best for growing businesses.</p><span class='text-4xl font-bold'>$50/month</span><ul class='mt-4 mb-6'><li class='py-1'>Feature 1</li><li class='py-1'>Feature 2</li><li class='py-1'>Feature 3</li></ul><button class='bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200'>Get Started</button></div></div></div></section>
```

### Example 3: Grid of Package Cards with Highlights

**When To Use**: When presenting multiple packages with distinct features, allowing users to easily scan and compare options.

**Why It Works**: The grid layout provides a clean structure, while highlighted features draw attention to key selling points. Responsive design ensures accessibility on mobile devices.

**Tailwind Notes**:
- Grid layout for organized presentation.
- Consistent card styling for a uniform look.
- Hover effects to improve user engagement.

```html
<section class='py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Packages</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Starter</h3><p class='text-gray-600 mb-4'>Great for individuals.</p><span class='text-2xl font-bold'>$15/month</span><ul class='mt-4 mb-6'><li class='py-1'>Feature 1</li><li class='py-1'>Feature 2</li><li class='py-1'>Feature 3</li></ul><button class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Choose Plan</button></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Business</h3><p class='text-gray-600 mb-4'>Perfect for small teams.</p><span class='text-2xl font-bold'>$35/month</span><ul class='mt-4 mb-6'><li class='py-1'>Feature 1</li><li class='py-1'>Feature 2</li><li class='py-1'>Feature 3</li></ul><button class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Choose Plan</button></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Enterprise</h3><p class='text-gray-600 mb-4'>For large organizations.</p><span class='text-2xl font-bold'>$100/month</span><ul class='mt-4 mb-6'><li class='py-1'>Feature 1</li><li class='py-1'>Feature 2</li><li class='py-1'>Feature 3</li></ul><button class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Choose Plan</button></div></div></div></section>
```

## `packages` / `stacked`

### Example 1: Basic Package Offerings

**When To Use**: Use this layout to present a straightforward list of package offerings with clear distinctions and CTAs.

**Why It Works**: The stacked layout allows users to easily compare different packages, while the use of contrasting colors and clear typography enhances readability and focus on the CTAs.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout adjustments.
- Consistent padding and margin create a clean, organized appearance.
- Hover effects on buttons provide immediate feedback.

```html
<section class='py-12 bg-gray-50'>
  <div class='max-w-7xl mx-auto px-4'>
    <h2 class='text-3xl font-bold text-center text-gray-800 mb-8'>Choose Your Plan</h2>
    <div class='flex flex-col md:flex-row md:space-x-4'>
      <div class='bg-white shadow-lg rounded-lg p-6 flex-1 mb-4 md:mb-0'>
        <h3 class='text-xl font-semibold text-gray-800'>Basic Plan</h3>
        <p class='text-gray-600 mt-2'>$10/month</p>
        <ul class='mt-4 space-y-2'>
          <li class='flex items-center'>
            <svg class='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 15l-5-5h10z'/></svg>
            <span class='ml-2'>Feature 1</span>
          </li>
          <li class='flex items-center'>
            <svg class='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 15l-5-5h10z'/></svg>
            <span class='ml-2'>Feature 2</span>
          </li>
        </ul>
        <a href='#' class='mt-6 block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>Select Plan</a>
      </div>
      <div class='bg-white shadow-lg rounded-lg p-6 flex-1 mb-4 md:mb-0'>
        <h3 class='text-xl font-semibold text-gray-800'>Pro Plan</h3>
        <p class='text-gray-600 mt-2'>$20/month</p>
        <ul class='mt-4 space-y-2'>
          <li class='flex items-center'>
            <svg class='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 15l-5-5h10z'/></svg>
            <span class='ml-2'>Feature 1</span>
          </li>
          <li class='flex items-center'>
            <svg class='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 15l-5-5h10z'/></svg>
            <span class='ml-2'>Feature 2</span>
          </li>
          <li class='flex items-center'>
            <svg class='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 15l-5-5h10z'/></svg>
            <span class='ml-2'>Feature 3</span>
          </li>
        </ul>
        <a href='#' class='mt-6 block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>Select Plan</a>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Advanced Package Comparison

**When To Use**: Ideal for showcasing multiple packages with detailed comparisons, highlighting the most popular option.

**Why It Works**: The use of a prominent card for the most popular plan draws attention, while the overall layout remains clean and structured for easy comparison.

**Tailwind Notes**:
- Employs responsive design to stack cards on smaller screens.
- Utilizes background colors to differentiate the featured package.
- Clear hierarchy established through typography and spacing.

```html
<section class='py-12 bg-white'>
  <div class='max-w-7xl mx-auto px-4'>
    <h2 class='text-3xl font-bold text-center text-gray-800 mb-8'>Our Packages</h2>
    <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
      <div class='bg-gray-100 shadow-md rounded-lg p-6'>
        <h3 class='text-xl font-semibold text-gray-800'>Basic</h3>
        <p class='text-gray-600 mt-2'>$10/month</p>
        <ul class='mt-4 space-y-2'>
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>
        <a href='#' class='mt-6 block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>Select</a>
      </div>
      <div class='bg-blue-500 text-white shadow-lg rounded-lg p-6'>
        <h3 class='text-xl font-semibold'>Most Popular</h3>
        <p class='text-2xl font-bold'>$25/month</p>
        <ul class='mt-4 space-y-2'>
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
        <a href='#' class='mt-6 block text-center bg-white text-blue-600 py-2 rounded-lg hover:bg-gray-100 transition'>Select</a>
      </div>
      <div class='bg-gray-100 shadow-md rounded-lg p-6'>
        <h3 class='text-xl font-semibold text-gray-800'>Premium</h3>
        <p class='text-gray-600 mt-2'>$40/month</p>
        <ul class='mt-4 space-y-2'>
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
          <li>Feature 4</li>
        </ul>
        <a href='#' class='mt-6 block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>Select</a>
      </div>
    </div>
  </div>
</section>
```

## `packages` / `featured`

### Example 1: Featured Plans with Emphasis on Pricing

**When To Use**: Use this layout when you want to highlight different pricing plans with a clear focus on the cost and value proposition.

**Why It Works**: This example uses a grid layout to display plans side by side, ensuring that users can easily compare features. The use of contrasting colors for the CTA buttons draws attention to the most important action, while the spacing and typography create a clean, professional look.

**Tailwind Notes**:
- Grid layout for responsive design.
- Clear hierarchy with headings and pricing emphasis.
- Consistent button styling enhances CTA visibility.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Choose Your Plan</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Basic Plan</h3><p class='text-2xl font-bold text-gray-800 mb-4'>$19/month</p><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><a href='#' class='block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'>Get Started</a></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Pro Plan</h3><p class='text-2xl font-bold text-gray-800 mb-4'>$39/month</p><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><a href='#' class='block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'>Get Started</a></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Enterprise Plan</h3><p class='text-2xl font-bold text-gray-800 mb-4'>$99/month</p><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><a href='#' class='block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'>Get Started</a></div></div></div></section>
```

### Example 2: Featured Plans with Highlighted Best Seller

**When To Use**: Ideal for situations where you want to draw attention to a specific plan as the best choice for most users.

**Why It Works**: This layout uses a prominent card design with a highlighted 'Best Seller' badge. The use of larger typography and contrasting colors for the highlighted plan makes it stand out, while the overall layout remains clean and structured for easy comparison.

**Tailwind Notes**:
- Use of badges for emphasis on the best seller.
- Consistent padding and margin for visual balance.
- Hover effects on buttons enhance interactivity.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Featured Plans</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-white shadow-lg rounded-lg p-6 relative'><span class='absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg'>Best Seller</span><h3 class='text-xl font-semibold mb-4'>Pro Plan</h3><p class='text-2xl font-bold text-gray-800 mb-4'>$39/month</p><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><a href='#' class='block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'>Get Started</a></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Basic Plan</h3><p class='text-2xl font-bold text-gray-800 mb-4'>$19/month</p><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><a href='#' class='block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'>Get Started</a></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Enterprise Plan</h3><p class='text-2xl font-bold text-gray-800 mb-4'>$99/month</p><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><a href='#' class='block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'>Get Started</a></div></div></div></section>
```

## `packages` / `tier-highlight`

### Example 1: Basic Tier Highlight with Emphasis on the Best Plan

**When To Use**: Use this layout to showcase different pricing tiers, highlighting the most popular or recommended plan.

**Why It Works**: This layout effectively uses contrast and typography to guide users' attention to the highlighted plan. The spacing and background colors create a clear visual hierarchy.

**Tailwind Notes**:
- Utilizes a grid layout for responsive design.
- Emphasizes the highlighted plan with a different background and border.
- Uses consistent spacing to maintain visual balance.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Choose Your Plan</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Basic</h3><p class='text-gray-600 mb-4'>Perfect for individuals.</p><p class='text-2xl font-bold mb-4'>$10/month</p><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Select</a></div><div class='bg-blue-100 border-2 border-blue-500 shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Popular</h3><p class='text-gray-600 mb-4'>Ideal for small teams.</p><p class='text-2xl font-bold mb-4'>$20/month</p><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Select</a></div><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Premium</h3><p class='text-gray-600 mb-4'>Best for large organizations.</p><p class='text-2xl font-bold mb-4'>$30/month</p><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Select</a></div></div></div></section>
```

### Example 2: Feature-Rich Tier Highlight with Detailed Descriptions

**When To Use**: Use this layout when you want to provide more information about each plan, including features and benefits.

**Why It Works**: This design uses cards with detailed descriptions to inform users about what each plan offers, with a clear emphasis on the highlighted plan. The use of icons enhances visual interest.

**Tailwind Notes**:
- Incorporates iconography for better engagement.
- Maintains readability with sufficient contrast and spacing.
- Responsive design adapts well to different screen sizes.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Pricing Plans</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-white shadow-md rounded-lg p-6 text-center'><div class='mb-4'><svg class='w-12 h-12 mx-auto text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 100 20 10 10 0 000-20zm1 15H9v-2h2v2zm0-4H9V6h2v5z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Basic</h3><p class='text-gray-600 mb-4'>For individuals and freelancers.</p><p class='text-2xl font-bold mb-4'>$10/month</p><ul class='text-left mb-4'><li>✔️ Feature 1</li><li>✔️ Feature 2</li><li>✔️ Feature 3</li></ul><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Select</a></div><div class='bg-blue-100 border-2 border-blue-500 shadow-md rounded-lg p-6 text-center'><div class='mb-4'><svg class='w-12 h-12 mx-auto text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 100 20 10 10 0 000-20zm1 15H9v-2h2v2zm0-4H9V6h2v5z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Popular</h3><p class='text-gray-600 mb-4'>For small teams.</p><p class='text-2xl font-bold mb-4'>$20/month</p><ul class='text-left mb-4'><li>✔️ Feature 1</li><li>✔️ Feature 2</li><li>✔️ Feature 3</li></ul><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Select</a></div><div class='bg-white shadow-md rounded-lg p-6 text-center'><div class='mb-4'><svg class='w-12 h-12 mx-auto text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 100 20 10 10 0 000-20zm1 15H9v-2h2v2zm0-4H9V6h2v5z'/></svg></div><h3 class='text-xl font-semibold mb-2'>Premium</h3><p class='text-gray-600 mb-4'>For large organizations.</p><p class='text-2xl font-bold mb-4'>$30/month</p><ul class='text-left mb-4'><li>✔️ Feature 1</li><li>✔️ Feature 2</li><li>✔️ Feature 3</li></ul><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Select</a></div></div></div></section>
```

## `deliverables` / `list`

### Example 1: Feature Highlights

**When To Use**: Use this layout to showcase key features of a product or service in a visually appealing manner.

**Why It Works**: The use of cards with distinct backgrounds and shadow effects creates a polished look, while adequate spacing ensures clarity. The typography hierarchy emphasizes the feature names, and the CTA buttons are designed to stand out.

**Tailwind Notes**:
- Utilizes grid layout for responsiveness.
- Employs shadow and background color for depth.
- Incorporates hover effects for interactivity.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-12'>Our Key Features</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Feature One</h3><p class='text-gray-600 mb-4'>A brief description of the feature that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Feature Two</h3><p class='text-gray-600 mb-4'>A brief description of the feature that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Feature Three</h3><p class='text-gray-600 mb-4'>A brief description of the feature that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div></div></section>
```

### Example 2: Service Offerings

**When To Use**: Ideal for displaying a list of services offered by a business, making it easy for potential clients to understand what is available.

**Why It Works**: The vertical list format with alternating background colors enhances readability. Each service card is designed to be visually distinct, and the use of icons adds a visual cue for each service, improving engagement.

**Tailwind Notes**:
- Alternating background colors for visual interest.
- Icons used to enhance comprehension.
- Responsive design ensures usability on all devices.

```html
<section class='py-16'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-12'>Our Services</h2><div class='space-y-8'><div class='bg-gray-100 p-6 rounded-lg flex items-center'><div class='mr-4'><svg class='w-8 h-8 text-blue-600' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z'/></svg></div><div><h3 class='text-xl font-semibold'>Service One</h3><p class='text-gray-700'>Description of service one that emphasizes its value.</p></div></div><div class='bg-white p-6 rounded-lg flex items-center'><div class='mr-4'><svg class='w-8 h-8 text-blue-600' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z'/></svg></div><div><h3 class='text-xl font-semibold'>Service Two</h3><p class='text-gray-700'>Description of service two that emphasizes its value.</p></div></div><div class='bg-gray-100 p-6 rounded-lg flex items-center'><div class='mr-4'><svg class='w-8 h-8 text-blue-600' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z'/></svg></div><div><h3 class='text-xl font-semibold'>Service Three</h3><p class='text-gray-700'>Description of service three that emphasizes its value.</p></div></div></div></div></section>
```

## `deliverables` / `grid`

### Example 1: Product Features Grid

**When To Use**: Use this layout to showcase multiple product features or services in a visually appealing way, ideal for landing pages.

**Why It Works**: The grid layout allows for clear organization of information, making it easy for users to scan and understand the offerings. The use of contrasting colors and ample white space enhances readability and focus on CTAs.

**Tailwind Notes**:
- Utilizes a responsive grid system for optimal layout on all screen sizes.
- Emphasizes CTAs with distinct colors and hover effects.
- Incorporates shadow and rounded corners for a polished card appearance.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Features</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white p-6 rounded-lg shadow-lg'><h3 class='text-xl font-semibold mb-4'>Feature One</h3><p class='text-gray-700 mb-4'>Description of feature one that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white p-6 rounded-lg shadow-lg'><h3 class='text-xl font-semibold mb-4'>Feature Two</h3><p class='text-gray-700 mb-4'>Description of feature two that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white p-6 rounded-lg shadow-lg'><h3 class='text-xl font-semibold mb-4'>Feature Three</h3><p class='text-gray-700 mb-4'>Description of feature three that highlights its benefits.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div></div></section>
```

### Example 2: Service Offerings Grid

**When To Use**: Ideal for service-based businesses to present their offerings in a structured and digestible format.

**Why It Works**: The grid format allows for a clean layout that makes it easy for potential clients to compare services. The use of hover effects enhances interactivity and encourages engagement.

**Tailwind Notes**:
- Responsive design ensures usability across devices.
- Hover effects on cards improve user interaction.
- Consistent padding and margins create a harmonious layout.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Services</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'><div class='bg-gray-100 p-5 rounded-lg shadow hover:shadow-lg transition'><h3 class='text-lg font-bold mb-3'>Consulting</h3><p class='text-gray-600 mb-4'>Expert advice to help your business grow.</p><a href='#' class='text-blue-600 font-semibold'>Read More</a></div><div class='bg-gray-100 p-5 rounded-lg shadow hover:shadow-lg transition'><h3 class='text-lg font-bold mb-3'>Development</h3><p class='text-gray-600 mb-4'>Custom software solutions tailored to your needs.</p><a href='#' class='text-blue-600 font-semibold'>Read More</a></div><div class='bg-gray-100 p-5 rounded-lg shadow hover:shadow-lg transition'><h3 class='text-lg font-bold mb-3'>Design</h3><p class='text-gray-600 mb-4'>Creative designs that capture your brand essence.</p><a href='#' class='text-blue-600 font-semibold'>Read More</a></div><div class='bg-gray-100 p-5 rounded-lg shadow hover:shadow-lg transition'><h3 class='text-lg font-bold mb-3'>Marketing</h3><p class='text-gray-600 mb-4'>Strategic marketing to boost your visibility.</p><a href='#' class='text-blue-600 font-semibold'>Read More</a></div></div></div></section>
```

## `deliverables` / `grouped`

### Example 1: Service Deliverables Overview

**When To Use**: Use this layout to present a clear overview of the services and deliverables offered by a business.

**Why It Works**: The use of cards with consistent spacing and typography creates a visually appealing layout that is easy to scan. The CTA buttons are prominent, encouraging user engagement.

**Tailwind Notes**:
- Grid layout provides responsiveness and adaptability to different screen sizes.
- Consistent padding and margin ensure a clean and organized appearance.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Deliverables</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Website Design</h3><p class='text-gray-600 mb-4'>Crafting visually stunning and user-friendly websites tailored to your brand.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>SEO Optimization</h3><p class='text-gray-600 mb-4'>Enhancing your website's visibility on search engines to drive more traffic.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Content Marketing</h3><p class='text-gray-600 mb-4'>Creating valuable content that attracts and engages your target audience.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div></div></section>
```

### Example 2: Project Deliverables Showcase

**When To Use**: Ideal for showcasing specific project deliverables in a visually engaging way.

**Why It Works**: The use of alternating background colors for the cards enhances visual interest and guides the user's eye. The clear headings and descriptions provide context, while the CTA buttons encourage further interaction.

**Tailwind Notes**:
- Alternating background colors create a dynamic look that keeps users engaged.
- Responsive design ensures that the layout adapts well on mobile devices.

```html
<section class='py-16'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Recent Projects</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-gray-100 shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>E-commerce Platform</h3><p class='text-gray-700 mb-4'>A fully responsive e-commerce site built for optimal user experience.</p><a href='#' class='inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition'>View Project</a></div><div class='bg-white shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Corporate Website</h3><p class='text-gray-700 mb-4'>A modern corporate site designed to showcase company values and services.</p><a href='#' class='inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition'>View Project</a></div><div class='bg-gray-100 shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Portfolio Site</h3><p class='text-gray-700 mb-4'>An interactive portfolio that highlights creative work and achievements.</p><a href='#' class='inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition'>View Project</a></div></div></div></section>
```

## `offer-stack` / `cards`

### Example 1: Promotional Offer Cards

**When To Use**: When showcasing multiple promotional offers or products to encourage user engagement and conversions.

**Why It Works**: The use of a grid layout with clear card designs allows for easy comparison of offers. The consistent spacing and hover effects enhance interactivity, while the strong CTAs drive user actions.

**Tailwind Notes**:
- Grid layout ensures responsiveness and adaptability to various screen sizes.
- Hover effects on cards enhance user engagement and visual feedback.

```html
<section class="py-12 bg-gray-50">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Our Exclusive Offers</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
        <h3 class="text-xl font-semibold mb-4">Offer 1</h3>
        <p class="text-gray-700 mb-4">Description of the first offer goes here.</p>
        <span class="text-lg font-bold text-blue-600">$99</span>
        <a href="#" class="mt-4 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Get Offer</a>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
        <h3 class="text-xl font-semibold mb-4">Offer 2</h3>
        <p class="text-gray-700 mb-4">Description of the second offer goes here.</p>
        <span class="text-lg font-bold text-blue-600">$149</span>
        <a href="#" class="mt-4 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Get Offer</a>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
        <h3 class="text-xl font-semibold mb-4">Offer 3</h3>
        <p class="text-gray-700 mb-4">Description of the third offer goes here.</p>
        <span class="text-lg font-bold text-blue-600">$199</span>
        <a href="#" class="mt-4 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Get Offer</a>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Feature Comparison Cards

**When To Use**: When highlighting different features or plans to facilitate user decision-making.

**Why It Works**: The structured layout allows users to easily compare features, while distinct card designs draw attention to each feature. The use of color contrast for CTAs ensures they stand out.

**Tailwind Notes**:
- Using a flex layout for the cards ensures clarity and focus on each feature.
- Color coding the CTAs enhances visual hierarchy and guides user actions.

```html
<section class="py-12 bg-white">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
    <div class="flex flex-col sm:flex-row justify-center gap-6">
      <div class="bg-gray-100 shadow-md rounded-lg p-6 flex-1">
        <h3 class="text-xl font-semibold mb-4">Basic Plan</h3>
        <ul class="mb-4">
          <li class="mb-2">Feature 1</li>
          <li class="mb-2">Feature 2</li>
          <li class="mb-2">Feature 3</li>
        </ul>
        <span class="text-lg font-bold text-blue-600">$49/month</span>
        <a href="#" class="mt-4 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Select Plan</a>
      </div>
      <div class="bg-gray-200 shadow-md rounded-lg p-6 flex-1">
        <h3 class="text-xl font-semibold mb-4">Standard Plan</h3>
        <ul class="mb-4">
          <li class="mb-2">Feature 1</li>
          <li class="mb-2">Feature 2</li>
          <li class="mb-2">Feature 3</li>
          <li class="mb-2">Feature 4</li>
        </ul>
        <span class="text-lg font-bold text-blue-600">$99/month</span>
        <a href="#" class="mt-4 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Select Plan</a>
      </div>
      <div class="bg-gray-300 shadow-md rounded-lg p-6 flex-1">
        <h3 class="text-xl font-semibold mb-4">Premium Plan</h3>
        <ul class="mb-4">
          <li class="mb-2">Feature 1</li>
          <li class="mb-2">Feature 2</li>
          <li class="mb-2">Feature 3</li>
          <li class="mb-2">Feature 4</li>
          <li class="mb-2">Feature 5</li>
        </ul>
        <span class="text-lg font-bold text-blue-600">$149/month</span>
        <a href="#" class="mt-4 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Select Plan</a>
      </div>
    </div>
  </div>
</section>
```

## `offer-stack` / `checklist`

### Example 1: Service Benefits Checklist

**When To Use**: Use this checklist to highlight key benefits of a service offering, especially for SaaS or subscription products.

**Why It Works**: The use of a clear, contrasting background with bold typography emphasizes the checklist items, while the CTA is prominent and encourages user engagement.

**Tailwind Notes**:
- bg-white for a clean surface that enhances readability.
- text-gray-800 for high contrast against the background.
- space-y-4 for consistent vertical spacing between items.
- hover:bg-blue-500 and text-white for CTA button to stand out.

```html
<section class='py-12 px-6 bg-white'>
  <h2 class='text-3xl font-bold text-center text-gray-800 mb-8'>Why Choose Our Service?</h2>
  <div class='max-w-2xl mx-auto space-y-4'>
    <div class='flex items-start p-4 border rounded-lg shadow-lg bg-gray-50'>
      <span class='text-green-500 text-2xl mr-4'>✔️</span>
      <p class='text-lg text-gray-700'>24/7 Customer Support</p>
    </div>
    <div class='flex items-start p-4 border rounded-lg shadow-lg bg-gray-50'>
      <span class='text-green-500 text-2xl mr-4'>✔️</span>
      <p class='text-lg text-gray-700'>Easy Integration</p>
    </div>
    <div class='flex items-start p-4 border rounded-lg shadow-lg bg-gray-50'>
      <span class='text-green-500 text-2xl mr-4'>✔️</span>
      <p class='text-lg text-gray-700'>Affordable Pricing</p>
    </div>
  </div>
  <div class='mt-8 text-center'>
    <a href='#' class='inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500'>Get Started</a>
  </div>
</section>
```

### Example 2: Product Feature Checklist

**When To Use**: Ideal for showcasing features of a product, especially in e-commerce or tech product landing pages.

**Why It Works**: The alternating background colors between checklist items create visual interest and help separate each feature, making it easier for users to digest information.

**Tailwind Notes**:
- bg-gray-100 for alternating item backgrounds to create visual separation.
- text-lg for clear readability.
- rounded-lg for a polished card look.
- max-w-lg to maintain a clean layout on larger screens.

```html
<section class='py-16 px-4 bg-gray-50'>
  <h2 class='text-4xl font-bold text-center text-gray-900 mb-10'>Features You'll Love</h2>
  <div class='max-w-3xl mx-auto'>
    <div class='bg-white p-6 rounded-lg shadow-md mb-4'>
      <h3 class='text-xl font-semibold text-gray-800'>Feature One</h3>
      <p class='text-gray-600'>Detailed description of feature one that highlights its benefits.</p>
    </div>
    <div class='bg-gray-100 p-6 rounded-lg shadow-md mb-4'>
      <h3 class='text-xl font-semibold text-gray-800'>Feature Two</h3>
      <p class='text-gray-600'>Detailed description of feature two that highlights its benefits.</p>
    </div>
    <div class='bg-white p-6 rounded-lg shadow-md'>
      <h3 class='text-xl font-semibold text-gray-800'>Feature Three</h3>
      <p class='text-gray-600'>Detailed description of feature three that highlights its benefits.</p>
    </div>
  </div>
  <div class='mt-10 text-center'>
    <a href='#' class='inline-block px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500'>Shop Now</a>
  </div>
</section>
```

## `offer-stack` / `tiered`

### Example 1: Basic Tiered Offer Stack

**When To Use**: Use this layout for showcasing product tiers with clear distinctions and CTAs.

**Why It Works**: The use of distinct background colors for each tier creates a visual hierarchy, while the consistent padding and margin ensure that the layout feels cohesive. The emphasis on the primary CTA button encourages conversions.

**Tailwind Notes**:
- bg-gray-100 for the background provides a neutral canvas.
- rounded-lg and shadow-lg give cards a polished look.
- text-center aligns all content for a clean presentation.
- hover:bg-blue-500 on buttons enhances interactivity.

```html
<section class='py-12 bg-gray-100'><div class='max-w-6xl mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Choose Your Plan</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white rounded-lg shadow-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Basic</h3><p class='text-gray-600 mb-4'>$10/month</p><p class='mb-6'>Access to basic features.</p><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600'>Get Started</a></div><div class='bg-blue-500 text-white rounded-lg shadow-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Pro</h3><p class='mb-4'>$20/month</p><p class='mb-6'>Access to all features.</p><a href='#' class='bg-white text-blue-500 py-2 px-4 rounded-lg hover:bg-gray-200'>Get Started</a></div><div class='bg-white rounded-lg shadow-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Enterprise</h3><p class='text-gray-600 mb-4'>Contact Us</p><p class='mb-6'>Custom solutions for your business.</p><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600'>Contact Sales</a></div></div></div></section>
```

### Example 2: Feature-Rich Tiered Offer Stack

**When To Use**: Ideal for showcasing multiple features and pricing options with a focus on the most valuable tier.

**Why It Works**: This design highlights the most valuable tier by using a different color and larger card size, drawing attention to it. The use of icons and feature lists enhances readability and appeal.

**Tailwind Notes**:
- bg-gray-50 creates a light, inviting background.
- flex and items-center for icon alignment improve visual flow.
- text-lg for feature descriptions ensures they are easily readable.
- border-2 border-blue-500 for the highlighted tier adds emphasis.

```html
<section class='py-12 bg-gray-50'><div class='max-w-6xl mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Our Pricing Plans</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-white rounded-lg shadow-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Starter</h3><p class='text-gray-600 mb-4'>$15/month</p><ul class='mb-6'><li class='flex items-center mb-2'><svg class='w-5 h-5 text-blue-500 mr-2' fill='currentColor'><circle cx='2.5' cy='2.5' r='2.5'/></svg>Feature 1</li><li class='flex items-center mb-2'><svg class='w-5 h-5 text-blue-500 mr-2' fill='currentColor'><circle cx='2.5' cy='2.5' r='2.5'/></svg>Feature 2</li></ul><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600'>Select Plan</a></div><div class='bg-blue-500 text-white rounded-lg shadow-lg p-8 text-center border-2 border-blue-600'><h3 class='text-xl font-semibold mb-4'>Professional</h3><p class='mb-4'>$30/month</p><ul class='mb-6'><li class='flex items-center mb-2'><svg class='w-5 h-5 text-white mr-2' fill='currentColor'><circle cx='2.5' cy='2.5' r='2.5'/></svg>Feature 1</li><li class='flex items-center mb-2'><svg class='w-5 h-5 text-white mr-2' fill='currentColor'><circle cx='2.5' cy='2.5' r='2.5'/></svg>Feature 2</li><li class='flex items-center mb-2'><svg class='w-5 h-5 text-white mr-2' fill='currentColor'><circle cx='2.5' cy='2.5' r='2.5'/></svg>Feature 3</li></ul><a href='#' class='bg-white text-blue-500 py-2 px-4 rounded-lg hover:bg-gray-200'>Select Plan</a></div><div class='bg-white rounded-lg shadow-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Business</h3><p class='text-gray-600 mb-4'>$50/month</p><ul class='mb-6'><li class='flex items-center mb-2'><svg class='w-5 h-5 text-blue-500 mr-2' fill='currentColor'><circle cx='2.5' cy='2.5' r='2.5'/></svg>Feature 1</li><li class='flex items-center mb-2'><svg class='w-5 h-5 text-blue-500 mr-2' fill='currentColor'><circle cx='2.5' cy='2.5' r='2.5'/></svg>Feature 2</li><li class='flex items-center mb-2'><svg class='w-5 h-5 text-blue-500 mr-2' fill='currentColor'><circle cx='2.5' cy='2.5' r='2.5'/></svg>Feature 3</li></ul><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600'>Select Plan</a></div></div></div></section>
```

## `how-it-works` / `numbered-steps`

### Example 1: Simple Numbered Steps with Icons

**When To Use**: Use this layout to visually guide users through a straightforward process with icons for each step.

**Why It Works**: The use of icons alongside text creates a clear visual hierarchy and aids in comprehension. The contrasting colors and ample spacing ensure that each step stands out, making it easy for users to follow the process.

**Tailwind Notes**:
- Grid layout for responsive design
- Consistent spacing between steps
- Use of icons for visual interest and clarity

```html
<section class='py-12 bg-gray-50'>
  <div class='container mx-auto text-center'>
    <h2 class='text-3xl font-bold mb-6'>How It Works</h2>
    <div class='grid grid-cols-1 md:grid-cols-3 gap-8'>
      <div class='bg-white p-6 rounded-lg shadow-lg'>
        <div class='flex items-center justify-center mb-4'>
          <span class='text-2xl font-bold text-blue-600'>1</span>
          <img src='icon1.svg' alt='Step 1' class='w-12 h-12 ml-2'>
        </div>
        <h3 class='text-lg font-semibold'>Step One</h3>
        <p class='text-gray-600'>Description of the first step goes here.</p>
      </div>
      <div class='bg-white p-6 rounded-lg shadow-lg'>
        <div class='flex items-center justify-center mb-4'>
          <span class='text-2xl font-bold text-blue-600'>2</span>
          <img src='icon2.svg' alt='Step 2' class='w-12 h-12 ml-2'>
        </div>
        <h3 class='text-lg font-semibold'>Step Two</h3>
        <p class='text-gray-600'>Description of the second step goes here.</p>
      </div>
      <div class='bg-white p-6 rounded-lg shadow-lg'>
        <div class='flex items-center justify-center mb-4'>
          <span class='text-2xl font-bold text-blue-600'>3</span>
          <img src='icon3.svg' alt='Step 3' class='w-12 h-12 ml-2'>
        </div>
        <h3 class='text-lg font-semibold'>Step Three</h3>
        <p class='text-gray-600'>Description of the third step goes here.</p>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Detailed Steps with Emphasized CTAs

**When To Use**: Ideal for processes that require user engagement at each step, such as sign-ups or onboarding.

**Why It Works**: The clear separation of steps with distinct backgrounds and the emphasis on CTAs makes it easy for users to understand what action to take next. The layout is responsive, ensuring usability on all devices.

**Tailwind Notes**:
- Use of background colors to differentiate steps
- Prominent CTAs with hover effects
- Responsive grid layout for mobile-first design

```html
<section class='py-16 bg-white'>
  <div class='container mx-auto text-center'>
    <h2 class='text-4xl font-bold mb-8'>How It Works</h2>
    <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
      <div class='bg-blue-50 p-8 rounded-lg shadow-md'>
        <h3 class='text-xl font-semibold mb-4'>Step 1: Register</h3>
        <p class='text-gray-700 mb-6'>Create your account by filling out a simple form.</p>
        <a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Get Started</a>
      </div>
      <div class='bg-green-50 p-8 rounded-lg shadow-md'>
        <h3 class='text-xl font-semibold mb-4'>Step 2: Customize</h3>
        <p class='text-gray-700 mb-6'>Tailor your preferences to suit your needs.</p>
        <a href='#' class='inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition'>Customize Now</a>
      </div>
      <div class='bg-yellow-50 p-8 rounded-lg shadow-md'>
        <h3 class='text-xl font-semibold mb-4'>Step 3: Launch</h3>
        <p class='text-gray-700 mb-6'>Start using our services and enjoy the benefits.</p>
        <a href='#' class='inline-block bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition'>Launch App</a>
      </div>
    </div>
  </div>
</section>
```

## `how-it-works` / `timeline`

### Example 1: Simple Vertical Timeline

**When To Use**: Use this layout for straightforward processes where each step is equally important and needs clear visibility.

**Why It Works**: This layout provides a clean, vertical flow that guides the user through the steps. The alternating background colors enhance readability and visual interest.

**Tailwind Notes**:
- Utilizes flexbox for alignment and spacing.
- Alternating background colors create a visual distinction between steps.
- Responsive design ensures readability on mobile devices.

```html
<section class='py-16 bg-gray-50'><div class='max-w-4xl mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>How It Works</h2><div class='flex flex-col space-y-10'><div class='flex items-start'><div class='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white'>1</div><div class='ml-4'><h3 class='text-xl font-semibold'>Step One</h3><p class='text-gray-600'>Description of the first step in the process.</p></div></div><div class='flex items-start'><div class='w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-500'>2</div><div class='ml-4'><h3 class='text-xl font-semibold'>Step Two</h3><p class='text-gray-600'>Description of the second step in the process.</p></div></div><div class='flex items-start'><div class='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white'>3</div><div class='ml-4'><h3 class='text-xl font-semibold'>Step Three</h3><p class='text-gray-600'>Description of the third step in the process.</p></div></div></div></div></section>
```

### Example 2: Horizontal Timeline with CTA

**When To Use**: Ideal for showcasing a series of steps with a call-to-action at the end, encouraging user engagement.

**Why It Works**: The horizontal layout allows for a quick overview of steps, while the prominent CTA at the end drives user action. The use of icons enhances the visual appeal and guides understanding.

**Tailwind Notes**:
- Flexbox layout for horizontal alignment.
- Incorporates icons for better visual communication.
- CTA is emphasized with a contrasting button style.

```html
<section class='py-16 bg-white'><div class='max-w-5xl mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Process</h2><div class='flex justify-between items-start mb-6'><div class='flex flex-col items-center'><div class='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white'>1</div><h3 class='text-lg font-semibold mt-2'>Step One</h3></div><div class='flex flex-col items-center'><div class='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white'>2</div><h3 class='text-lg font-semibold mt-2'>Step Two</h3></div><div class='flex flex-col items-center'><div class='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white'>3</div><h3 class='text-lg font-semibold mt-2'>Step Three</h3></div></div><div class='text-center'><p class='text-lg mb-4'>Ready to get started?</p><a href='#' class='bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300'>Get Started</a></div></div></section>
```

### Example 3: Step-by-Step Card Layout

**When To Use**: Best for processes that require detailed explanations for each step, allowing users to digest information at their own pace.

**Why It Works**: The card layout provides a modular approach, making it easy to scan through steps. Each card can be clicked for more details, enhancing interactivity.

**Tailwind Notes**:
- Grid layout for responsive card arrangement.
- Hover effects on cards improve engagement.
- Consistent padding and margins for visual harmony.

```html
<section class='py-16 bg-gray-100'><div class='max-w-6xl mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>How It Works</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300'><h3 class='text-xl font-semibold'>Step One</h3><p class='text-gray-600'>Brief description of the first step.</p><a href='#' class='text-blue-600 mt-4 block'>Learn More</a></div><div class='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300'><h3 class='text-xl font-semibold'>Step Two</h3><p class='text-gray-600'>Brief description of the second step.</p><a href='#' class='text-blue-600 mt-4 block'>Learn More</a></div><div class='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300'><h3 class='text-xl font-semibold'>Step Three</h3><p class='text-gray-600'>Brief description of the third step.</p><a href='#' class='text-blue-600 mt-4 block'>Learn More</a></div></div></div></section>
```

## `how-it-works` / `zigzag`

### Example 1: Basic Zigzag Steps

**When To Use**: Use this layout to introduce a straightforward process or series of steps in a visually engaging way.

**Why It Works**: The alternating layout creates visual interest and helps guide the user's eye through the steps. The clear hierarchy and ample spacing enhance readability, while the contrasting CTA buttons draw attention.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Alternates background colors for visual separation.
- Includes ample padding for touch targets.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>How It Works</h2><div class='flex flex-col md:flex-row md:space-x-8'><div class='flex-1 mb-8 md:mb-0'><div class='bg-white p-6 shadow-lg rounded-lg'><h3 class='text-xl font-semibold mb-4'>Step 1</h3><p class='text-gray-700 mb-4'>Description of the first step in the process.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Get Started</a></div></div><div class='flex-1 mb-8 md:mb-0'><div class='bg-gray-200 p-6 shadow-lg rounded-lg'><h3 class='text-xl font-semibold mb-4'>Step 2</h3><p class='text-gray-700 mb-4'>Description of the second step in the process.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div><div class='flex-1'><div class='bg-white p-6 shadow-lg rounded-lg'><h3 class='text-xl font-semibold mb-4'>Step 3</h3><p class='text-gray-700 mb-4'>Description of the third step in the process.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Join Now</a></div></div></div></div></section>
```

### Example 2: Zigzag with Icons

**When To Use**: Ideal for processes that benefit from visual cues, such as icons or illustrations, to enhance understanding.

**Why It Works**: Incorporating icons adds a layer of visual communication, making the steps easier to digest. The consistent use of colors and spacing maintains a polished look, while the responsive design ensures usability on all devices.

**Tailwind Notes**:
- Uses icons for immediate visual recognition.
- Maintains consistent spacing and alignment.
- Responsive design adapts to different screen sizes.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Process</h2><div class='flex flex-col md:flex-row md:space-x-8'><div class='flex-1 mb-8 md:mb-0'><div class='flex items-start'><div class='mr-4'><svg class='w-12 h-12 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4' /></svg></div><div><h3 class='text-xl font-semibold mb-2'>Step 1</h3><p class='text-gray-600'>Initial consultation to discuss your needs.</p><a href='#' class='mt-2 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Get Started</a></div></div></div><div class='flex-1 mb-8 md:mb-0'><div class='flex items-start'><div class='mr-4'><svg class='w-12 h-12 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4' /></svg></div><div><h3 class='text-xl font-semibold mb-2'>Step 2</h3><p class='text-gray-600'>Developing a tailored plan for implementation.</p><a href='#' class='mt-2 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div></div><div class='flex-1'><div class='flex items-start'><div class='mr-4'><svg class='w-12 h-12 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4v16m8-8H4' /></svg></div><div><h3 class='text-xl font-semibold mb-2'>Step 3</h3><p class='text-gray-600'>Final review and delivery of the project.</p><a href='#' class='mt-2 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Join Now</a></div></div></div></div></div></section>
```

## `how-it-works` / `horizontal`

### Example 1: Three-Step Process

**When To Use**: When you want to clearly communicate a simple three-step process to users.

**Why It Works**: This layout provides a clean and organized presentation of steps, allowing users to quickly grasp the process. The use of icons enhances visual interest and aids comprehension.

**Tailwind Notes**:
- Flexbox layout for horizontal alignment of steps.
- Consistent spacing ensures readability and a polished look.
- Hover effects on buttons improve interactivity.

```html
<section class="py-12 bg-gray-50">
  <div class="container mx-auto text-center">
    <h2 class="text-3xl font-bold mb-6">How It Works</h2>
    <div class="flex justify-center space-x-8">
      <div class="flex flex-col items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div class="mb-4">
          <svg class="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="..." /></svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Step One</h3>
        <p class="text-gray-600 mb-4">Description of the first step in the process.</p>
        <a href="#" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Get Started</a>
      </div>
      <div class="flex flex-col items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div class="mb-4">
          <svg class="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="..." /></svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Step Two</h3>
        <p class="text-gray-600 mb-4">Description of the second step in the process.</p>
        <a href="#" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Learn More</a>
      </div>
      <div class="flex flex-col items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div class="mb-4">
          <svg class="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="..." /></svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Step Three</h3>
        <p class="text-gray-600 mb-4">Description of the third step in the process.</p>
        <a href="#" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Get Started</a>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Five-Step Workflow

**When To Use**: When detailing a more complex process that requires more steps to be presented clearly.

**Why It Works**: The use of a grid layout allows for a structured presentation, making it easy for users to follow along. The alternating background colors help to visually separate each step.

**Tailwind Notes**:
- Grid layout for responsive design, adjusting to smaller screens.
- Use of background colors for visual separation of steps.
- Clear typography for headings and body text enhances readability.

```html
<section class="py-12 bg-white">
  <div class="container mx-auto text-center">
    <h2 class="text-3xl font-bold mb-6">Our Workflow</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      <div class="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2">Step 1</h3>
        <p class="text-gray-600 mb-4">Initial consultation to understand your needs.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2">Step 2</h3>
        <p class="text-gray-600 mb-4">Developing a tailored solution for you.</p>
      </div>
      <div class="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2">Step 3</h3>
        <p class="text-gray-600 mb-4">Implementation of the solution.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2">Step 4</h3>
        <p class="text-gray-600 mb-4">Testing and quality assurance.</p>
      </div>
      <div class="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2">Step 5</h3>
        <p class="text-gray-600 mb-4">Final delivery and support.</p>
      </div>
    </div>
  </div>
</section>
```

## `how-it-works` / `cards`

### Example 1: Three-Step Process

**When To Use**: Use this layout to present a simple, three-step process for users to understand how your service works.

**Why It Works**: The use of a grid layout with cards provides clear separation of steps, making it easy for users to digest information. The intentional use of color and spacing enhances readability and focus on the CTAs.

**Tailwind Notes**:
- Grid layout allows for responsive design, adjusting to different screen sizes.
- Consistent padding and margin create a clean and organized appearance.
- Hover effects on cards encourage user interaction.

```html
<section class='py-12 bg-gray-100'>
  <div class='container mx-auto text-center'>
    <h2 class='text-3xl font-bold mb-6'>How It Works</h2>
    <p class='text-lg text-gray-600 mb-12'>Follow these simple steps to get started.</p>
    <div class='grid grid-cols-1 md:grid-cols-3 gap-8'>
      <div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'>
        <h3 class='text-xl font-semibold mb-4'>Step 1</h3>
        <p class='text-gray-500 mb-4'>Sign up for an account to get started.</p>
        <a href='#' class='inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Get Started</a>
      </div>
      <div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'>
        <h3 class='text-xl font-semibold mb-4'>Step 2</h3>
        <p class='text-gray-500 mb-4'>Choose a plan that fits your needs.</p>
        <a href='#' class='inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Choose Plan</a>
      </div>
      <div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'>
        <h3 class='text-xl font-semibold mb-4'>Step 3</h3>
        <p class='text-gray-500 mb-4'>Start using our service and enjoy!</p>
        <a href='#' class='inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Start Now</a>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Detailed Four-Step Guide

**When To Use**: This layout is ideal for more complex services that require users to follow multiple steps, providing detailed descriptions for each step.

**Why It Works**: The four-column layout allows for ample space for text and visuals, while maintaining a clean design. The use of contrasting colors for the CTA buttons draws attention and encourages clicks.

**Tailwind Notes**:
- Flexbox ensures alignment and distribution of cards is consistent across various devices.
- Use of rounded corners and shadows gives a modern and polished look.
- Text hierarchy is established through varying font sizes and weights.

```html
<section class='py-16 bg-white'>
  <div class='container mx-auto text-center'>
    <h2 class='text-4xl font-bold mb-8'>How Our Process Works</h2>
    <p class='text-lg text-gray-700 mb-10'>Follow these steps to make the most of our service.</p>
    <div class='flex flex-wrap justify-center gap-6'>
      <div class='bg-gray-50 border border-gray-200 rounded-lg p-6 w-full sm:w-1/2 md:w-1/4'>
        <h3 class='text-xl font-semibold mb-3'>Step 1</h3>
        <p class='text-gray-600 mb-4'>Create your account quickly and easily.</p>
        <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700'>Sign Up</a>
      </div>
      <div class='bg-gray-50 border border-gray-200 rounded-lg p-6 w-full sm:w-1/2 md:w-1/4'>
        <h3 class='text-xl font-semibold mb-3'>Step 2</h3>
        <p class='text-gray-600 mb-4'>Select the features you need.</p>
        <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700'>Select Features</a>
      </div>
      <div class='bg-gray-50 border border-gray-200 rounded-lg p-6 w-full sm:w-1/2 md:w-1/4'>
        <h3 class='text-xl font-semibold mb-3'>Step 3</h3>
        <p class='text-gray-600 mb-4'>Customize your settings.</p>
        <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700'>Customize</a>
      </div>
      <div class='bg-gray-50 border border-gray-200 rounded-lg p-6 w-full sm:w-1/2 md:w-1/4'>
        <h3 class='text-xl font-semibold mb-3'>Step 4</h3>
        <p class='text-gray-600 mb-4'>Enjoy your personalized experience!</p>
        <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700'>Start Enjoying</a>
      </div>
    </div>
  </div>
</section>
```

## `onboarding-flow` / `steps`

### Example 1: Three-Step Onboarding Process

**When To Use**: Use this layout to guide users through a simple onboarding process with clear steps.

**Why It Works**: The use of distinct cards for each step creates a clear visual hierarchy, while the consistent spacing and typography maintain readability and focus on the CTAs.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs background colors to enhance contrast.
- Generous padding and margin for touch targets and readability.

```html
<section class='bg-gray-50 py-16'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Get Started in 3 Easy Steps</h2><div class='flex flex-col md:flex-row justify-between'> <div class='bg-white shadow-lg rounded-lg p-6 mb-6 md:mb-0 md:w-1/3'><h3 class='text-xl font-semibold mb-4'>Step 1: Sign Up</h3><p class='text-gray-700 mb-4'>Create your account in just a few minutes.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Get Started</a></div><div class='bg-white shadow-lg rounded-lg p-6 mb-6 md:mb-0 md:w-1/3'><h3 class='text-xl font-semibold mb-4'>Step 2: Customize</h3><p class='text-gray-700 mb-4'>Personalize your settings and preferences.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Customize Now</a></div><div class='bg-white shadow-lg rounded-lg p-6 md:w-1/3'><h3 class='text-xl font-semibold mb-4'>Step 3: Launch</h3><p class='text-gray-700 mb-4'>Start using our service and enjoy!</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Launch App</a></div></div></div></section>
```

### Example 2: Five-Step Onboarding Journey

**When To Use**: Ideal for more complex onboarding processes that require multiple steps to explain features or setup.

**Why It Works**: The grid layout allows for a clean presentation of multiple steps, with ample space to detail each step's importance. The use of icons adds visual interest and aids comprehension.

**Tailwind Notes**:
- Grid layout for optimal use of space and responsiveness.
- Icons enhance visual communication of each step.
- Consistent use of colors for CTAs to unify the design.

```html
<section class='bg-white py-16'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-10'>Your Onboarding Journey</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'> <div class='bg-gray-100 rounded-lg p-6 text-center'><div class='text-blue-600 mb-4'><svg class='w-12 h-12 mx-auto' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-lg font-semibold mb-2'>Step 1</h3><p class='text-gray-600'>Create your account.</p></div><div class='bg-gray-100 rounded-lg p-6 text-center'><div class='text-blue-600 mb-4'><svg class='w-12 h-12 mx-auto' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-lg font-semibold mb-2'>Step 2</h3><p class='text-gray-600'>Set up your profile.</p></div><div class='bg-gray-100 rounded-lg p-6 text-center'><div class='text-blue-600 mb-4'><svg class='w-12 h-12 mx-auto' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-lg font-semibold mb-2'>Step 3</h3><p class='text-gray-600'>Explore features.</p></div><div class='bg-gray-100 rounded-lg p-6 text-center'><div class='text-blue-600 mb-4'><svg class='w-12 h-12 mx-auto' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-lg font-semibold mb-2'>Step 4</h3><p class='text-gray-600'>Connect with others.</p></div><div class='bg-gray-100 rounded-lg p-6 text-center'><div class='text-blue-600 mb-4'><svg class='w-12 h-12 mx-auto' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16 8 8 0 000-16z'/></svg></div><h3 class='text-lg font-semibold mb-2'>Step 5</h3><p class='text-gray-600'>Start your journey!</p></div></div></div></section>
```

## `onboarding-flow` / `phases`

### Example 1: Three-Step Onboarding Process

**When To Use**: Use this layout to clearly outline a simple three-step onboarding process for users, ideal for SaaS products.

**Why It Works**: The use of distinct cards for each step creates a clear visual hierarchy, and the contrasting colors for CTAs guide users through the flow effortlessly.

**Tailwind Notes**:
- Flexbox layout for responsive design.
- Consistent padding and margins for spacing.
- Emphasis on CTAs with contrasting colors.

```html
<section class='bg-gray-50 py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Get Started in 3 Easy Steps</h2><div class='flex flex-col md:flex-row justify-between gap-6'><div class='bg-white shadow-lg rounded-lg p-6 flex-1'><h3 class='text-xl font-semibold mb-4'>Step 1: Sign Up</h3><p class='text-gray-700 mb-4'>Create your account to access our features.</p><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Get Started</a></div><div class='bg-white shadow-lg rounded-lg p-6 flex-1'><h3 class='text-xl font-semibold mb-4'>Step 2: Customize</h3><p class='text-gray-700 mb-4'>Tailor your experience to fit your needs.</p><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Customize Now</a></div><div class='bg-white shadow-lg rounded-lg p-6 flex-1'><h3 class='text-xl font-semibold mb-4'>Step 3: Launch</h3><p class='text-gray-700 mb-4'>Start using our platform to achieve your goals.</p><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Launch App</a></div></div></div></section>
```

### Example 2: Multi-Phase Onboarding Flow

**When To Use**: Ideal for products with a more complex onboarding process that requires users to understand multiple phases.

**Why It Works**: The use of a vertical stepper layout with clear icons and descriptions enhances user comprehension and engagement, while the responsive design ensures usability on all devices.

**Tailwind Notes**:
- Vertical layout for better flow understanding.
- Icons add visual interest and clarity.
- Responsive adjustments for smaller screens.

```html
<section class='bg-white py-16'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-10'>Onboarding Made Easy</h2><div class='flex flex-col md:flex-row justify-between'><div class='flex-1 mb-6 md:mb-0'><div class='flex items-center mb-4'><div class='w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4'>1</div><h3 class='text-xl font-semibold'>Create Account</h3></div><p class='text-gray-600'>Sign up to access our platform and start your journey.</p></div><div class='flex-1 mb-6 md:mb-0'><div class='flex items-center mb-4'><div class='w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4'>2</div><h3 class='text-xl font-semibold'>Set Preferences</h3></div><p class='text-gray-600'>Customize your settings for a personalized experience.</p></div><div class='flex-1'><div class='flex items-center mb-4'><div class='w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4'>3</div><h3 class='text-xl font-semibold'>Start Using</h3></div><p class='text-gray-600'>Begin your journey and explore our features.</p></div></div></div></section>
```

## `onboarding-flow` / `milestones`

### Example 1: Three-Step Onboarding Milestones

**When To Use**: Use this layout to highlight a simple three-step onboarding process for users, making it clear and visually appealing.

**Why It Works**: The use of distinct cards for each milestone creates a clear hierarchy, while the consistent use of colors and spacing ensures a polished look. The CTA buttons are prominent, encouraging user interaction.

**Tailwind Notes**:
- Flexbox layout for responsive design.
- Consistent spacing for visual balance.
- Strong contrast for CTA buttons to draw attention.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Your Onboarding Journey</h2><div class='flex flex-wrap justify-center gap-8'><div class='w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Step 1: Sign Up</h3><p class='text-gray-600 mb-4'>Create your account to get started.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Get Started</a></div><div class='w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Step 2: Customize</h3><p class='text-gray-600 mb-4'>Set your preferences to tailor your experience.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Customize Now</a></div><div class='w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Step 3: Launch</h3><p class='text-gray-600 mb-4'>Start using the platform and enjoy!</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Launch App</a></div></div></div></section>
```

### Example 2: Five-Step Onboarding Milestones with Icons

**When To Use**: Ideal for a more detailed onboarding process where each step has an associated icon for visual guidance.

**Why It Works**: Incorporating icons with text enhances comprehension and retention. The grid layout adapts well to various screen sizes, ensuring a seamless experience across devices.

**Tailwind Notes**:
- Grid layout for flexibility and responsiveness.
- Icons add visual interest and aid understanding.
- Hover effects on buttons improve user engagement.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Complete Your Onboarding</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'><div class='bg-gray-100 p-4 rounded-lg shadow'><img src='icon1.svg' alt='Step 1' class='mb-2 mx-auto w-12 h-12'><h3 class='text-lg font-semibold'>Step 1</h3><p class='text-gray-600'>Create your account.</p><a href='#' class='mt-2 inline-block bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition'>Start</a></div><div class='bg-gray-100 p-4 rounded-lg shadow'><img src='icon2.svg' alt='Step 2' class='mb-2 mx-auto w-12 h-12'><h3 class='text-lg font-semibold'>Step 2</h3><p class='text-gray-600'>Set your preferences.</p><a href='#' class='mt-2 inline-block bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition'>Next</a></div><div class='bg-gray-100 p-4 rounded-lg shadow'><img src='icon3.svg' alt='Step 3' class='mb-2 mx-auto w-12 h-12'><h3 class='text-lg font-semibold'>Step 3</h3><p class='text-gray-600'>Explore features.</p><a href='#' class='mt-2 inline-block bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition'>Explore</a></div><div class='bg-gray-100 p-4 rounded-lg shadow'><img src='icon4.svg' alt='Step 4' class='mb-2 mx-auto w-12 h-12'><h3 class='text-lg font-semibold'>Step 4</h3><p class='text-gray-600'>Invite your team.</p><a href='#' class='mt-2 inline-block bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition'>Invite</a></div><div class='bg-gray-100 p-4 rounded-lg shadow'><img src='icon5.svg' alt='Step 5' class='mb-2 mx-auto w-12 h-12'><h3 class='text-lg font-semibold'>Step 5</h3><p class='text-gray-600'>Launch your project!</p><a href='#' class='mt-2 inline-block bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition'>Launch</a></div></div></div></section>
```

## `methodology` / `cards`

### Example 1: Three-Step Methodology Cards

**When To Use**: When showcasing a simple, clear methodology with three distinct steps that guide users through a process.

**Why It Works**: The use of distinct cards allows for easy scanning, while the consistent spacing and typography create a polished look. The emphasis on CTAs encourages user interaction.

**Tailwind Notes**:
- Flexbox layout for responsive design
- Consistent padding and margin for spacing
- Hover effects for interactivity

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Methodology</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Step 1: Discovery</h3><p class='text-gray-700 mb-4'>We analyze your needs and gather requirements to ensure a perfect fit.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Step 2: Design</h3><p class='text-gray-700 mb-4'>Our team creates tailored solutions that align with your goals.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Step 3: Delivery</h3><p class='text-gray-700 mb-4'>We deliver and implement the solutions, ensuring a smooth transition.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div></div></section>
```

### Example 2: Four-Card Methodology Showcase

**When To Use**: Ideal for presenting a more complex methodology with four steps, suitable for a detailed explanation of a process.

**Why It Works**: The grid layout allows for a balanced presentation of information, while the use of color and shadows enhances visual hierarchy and draws attention to each card.

**Tailwind Notes**:
- Grid layout adapts to screen size
- Color contrast for readability
- Shadow for depth and emphasis

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-4xl font-bold text-center mb-10'>Our Proven Methodology</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'><div class='bg-blue-100 shadow-lg rounded-lg p-6'><h3 class='text-2xl font-semibold mb-3'>Research</h3><p class='text-gray-600'>In-depth analysis of market trends and customer needs.</p></div><div class='bg-blue-200 shadow-lg rounded-lg p-6'><h3 class='text-2xl font-semibold mb-3'>Strategy</h3><p class='text-gray-600'>Crafting a tailored strategy to meet your goals.</p></div><div class='bg-blue-300 shadow-lg rounded-lg p-6'><h3 class='text-2xl font-semibold mb-3'>Execution</h3><p class='text-gray-600'>Implementing the plan with precision and care.</p></div><div class='bg-blue-400 shadow-lg rounded-lg p-6'><h3 class='text-2xl font-semibold mb-3'>Review</h3><p class='text-gray-600'>Assessing the results and optimizing for success.</p></div></div></div></section>
```

## `methodology` / `rows`

### Example 1: Three-Step Methodology Overview

**When To Use**: Use this layout to present a clear, concise overview of a three-step process that guides users through your methodology.

**Why It Works**: The layout uses a grid to create a balanced visual hierarchy, ensuring that each step is distinct yet part of a cohesive whole. The use of icons enhances comprehension and adds visual interest.

**Tailwind Notes**:
- Grid layout for responsive design.
- Consistent spacing for clear separation between steps.
- Emphasis on CTAs with contrasting colors.

```html
<section class='py-16 bg-gray-50'>
  <div class='container mx-auto text-center'>
    <h2 class='text-3xl font-bold mb-8'>Our Methodology</h2>
    <div class='grid grid-cols-1 md:grid-cols-3 gap-8'>
      <div class='bg-white p-6 rounded-lg shadow-md'>
        <div class='flex items-center justify-center mb-4'>
          <svg class='w-12 h-12 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0L12.5 7.5H20L14 12.5L16.5 20L10 15L3.5 20L6 12.5L0 7.5H7.5L10 0Z'/></svg>
        </div>
        <h3 class='text-xl font-semibold mb-2'>Step 1: Discover</h3>
        <p class='text-gray-600 mb-4'>Identify customer needs and market opportunities.</p>
        <a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a>
      </div>
      <div class='bg-white p-6 rounded-lg shadow-md'>
        <div class='flex items-center justify-center mb-4'>
          <svg class='w-12 h-12 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0L12.5 7.5H20L14 12.5L16.5 20L10 15L3.5 20L6 12.5L0 7.5H7.5L10 0Z'/></svg>
        </div>
        <h3 class='text-xl font-semibold mb-2'>Step 2: Design</h3>
        <p class='text-gray-600 mb-4'>Create innovative solutions tailored to user needs.</p>
        <a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a>
      </div>
      <div class='bg-white p-6 rounded-lg shadow-md'>
        <div class='flex items-center justify-center mb-4'>
          <svg class='w-12 h-12 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0L12.5 7.5H20L14 12.5L16.5 20L10 15L3.5 20L6 12.5L0 7.5H7.5L10 0Z'/></svg>
        </div>
        <h3 class='text-xl font-semibold mb-2'>Step 3: Deliver</h3>
        <p class='text-gray-600 mb-4'>Implement solutions and measure success.</p>
        <a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Four-Phase Methodology with Visuals

**When To Use**: Ideal for showcasing a more complex methodology that requires additional visual support to enhance understanding.

**Why It Works**: Utilizing a two-column layout with images and text allows for a more engaging presentation. The alternating layout keeps the content dynamic and visually appealing, while the clear CTAs encourage user interaction.

**Tailwind Notes**:
- Alternating layout for visual interest.
- Use of images to support text and enhance storytelling.
- Responsive adjustments for mobile-friendly design.

```html
<section class='py-16 bg-white'>
  <div class='container mx-auto'>
    <h2 class='text-3xl font-bold text-center mb-10'>Our Four-Phase Approach</h2>
    <div class='flex flex-wrap'>
      <div class='w-full md:w-1/2 p-4'>
        <div class='flex flex-col items-center'>
          <img src='phase1.jpg' alt='Phase 1' class='mb-4 rounded-lg shadow-md'>
          <h3 class='text-2xl font-semibold mb-2'>Phase 1: Research</h3>
          <p class='text-gray-700'>In-depth analysis of market trends and user behavior.</p>
          <a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Explore More</a>
        </div>
      </div>
      <div class='w-full md:w-1/2 p-4'>
        <div class='flex flex-col items-center'>
          <img src='phase2.jpg' alt='Phase 2' class='mb-4 rounded-lg shadow-md'>
          <h3 class='text-2xl font-semibold mb-2'>Phase 2: Strategy</h3>
          <p class='text-gray-700'>Developing actionable strategies based on research insights.</p>
          <a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Explore More</a>
        </div>
      </div>
      <div class='w-full md:w-1/2 p-4'>
        <div class='flex flex-col items-center'>
          <img src='phase3.jpg' alt='Phase 3' class='mb-4 rounded-lg shadow-md'>
          <h3 class='text-2xl font-semibold mb-2'>Phase 3: Design</h3>
          <p class='text-gray-700'>Creating user-centric designs that resonate.</p>
          <a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Explore More</a>
        </div>
      </div>
      <div class='w-full md:w-1/2 p-4'>
        <div class='flex flex-col items-center'>
          <img src='phase4.jpg' alt='Phase 4' class='mb-4 rounded-lg shadow-md'>
          <h3 class='text-2xl font-semibold mb-2'>Phase 4: Implementation</h3>
          <p class='text-gray-700'>Bringing strategies to life with effective execution.</p>
          <a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Explore More</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

## `methodology` / `principles`

### Example 1: Three Core Principles

**When To Use**: Use this layout when you want to clearly communicate key principles of your methodology in a visually engaging way.

**Why It Works**: This example utilizes a grid layout for clear organization, making it easy for users to scan and understand the principles. The use of contrasting colors for headings and backgrounds enhances readability and focus on each principle.

**Tailwind Notes**:
- Grid layout allows for responsive design and easy alignment.
- Contrast between text and background improves legibility.
- Consistent spacing creates a polished look.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Core Principles</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white p-6 rounded-lg shadow-lg'><h3 class='text-xl font-semibold text-blue-600 mb-4'>Principle One</h3><p class='text-gray-700'>Description of the first principle that explains its importance and application.</p></div><div class='bg-white p-6 rounded-lg shadow-lg'><h3 class='text-xl font-semibold text-blue-600 mb-4'>Principle Two</h3><p class='text-gray-700'>Description of the second principle that explains its importance and application.</p></div><div class='bg-white p-6 rounded-lg shadow-lg'><h3 class='text-xl font-semibold text-blue-600 mb-4'>Principle Three</h3><p class='text-gray-700'>Description of the third principle that explains its importance and application.</p></div></div></div></section>
```

### Example 2: Five Guiding Principles with Icons

**When To Use**: This layout is effective when you want to incorporate visual elements like icons to enhance understanding and retention of principles.

**Why It Works**: By adding icons alongside text, the principles become more memorable. The layout is responsive, ensuring that the principles stack nicely on smaller screens while maintaining clarity on larger displays.

**Tailwind Notes**:
- Flexbox layout for aligning icons and text.
- Responsive design ensures usability across devices.
- Use of icons adds visual interest and aids comprehension.

```html
<section class='py-12 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Guiding Principles</h2><div class='flex flex-wrap justify-between'><div class='flex items-start w-full md:w-1/2 lg:w-1/4 mb-6'><img src='icon1.png' alt='Icon 1' class='h-12 w-12 mr-4'><div><h3 class='text-xl font-semibold text-blue-600'>Integrity</h3><p class='text-gray-700'>We uphold the highest standards of integrity in all our actions.</p></div></div><div class='flex items-start w-full md:w-1/2 lg:w-1/4 mb-6'><img src='icon2.png' alt='Icon 2' class='h-12 w-12 mr-4'><div><h3 class='text-xl font-semibold text-blue-600'>Innovation</h3><p class='text-gray-700'>We pursue innovation to deliver the best solutions.</p></div></div><div class='flex items-start w-full md:w-1/2 lg:w-1/4 mb-6'><img src='icon3.png' alt='Icon 3' class='h-12 w-12 mr-4'><div><h3 class='text-xl font-semibold text-blue-600'>Collaboration</h3><p class='text-gray-700'>We believe in the power of collaboration to achieve great results.</p></div></div><div class='flex items-start w-full md:w-1/2 lg:w-1/4 mb-6'><img src='icon4.png' alt='Icon 4' class='h-12 w-12 mr-4'><div><h3 class='text-xl font-semibold text-blue-600'>Excellence</h3><p class='text-gray-700'>We strive for excellence in everything we do.</p></div></div><div class='flex items-start w-full md:w-1/2 lg:w-1/4 mb-6'><img src='icon5.png' alt='Icon 5' class='h-12 w-12 mr-4'><div><h3 class='text-xl font-semibold text-blue-600'>Accountability</h3><p class='text-gray-700'>We take responsibility for our actions and decisions.</p></div></div></div></div></section>
```

## `testimonials` / `cards`

### Example 1: Simple Grid Testimonials

**When To Use**: Use this layout when you have multiple testimonials to showcase in a visually appealing grid format, ideal for a landing page.

**Why It Works**: The grid layout allows for easy scanning of testimonials, while the card design adds depth and visual interest. The use of shadows and rounded corners creates a polished look.

**Tailwind Notes**:
- Grid layout with responsive columns enhances readability.
- Consistent padding and spacing create a clean and organized appearance.
- Contrast in text and background colors draws attention to testimonials.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>What Our Clients Say</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white p-6 rounded-lg shadow-lg'><p class='text-gray-600 mb-4'>“This product changed my life! I can't recommend it enough.”</p><h3 class='text-lg font-semibold'>Jane Doe</h3><span class='text-sm text-gray-500'>CEO, Company A</span></div><div class='bg-white p-6 rounded-lg shadow-lg'><p class='text-gray-600 mb-4'>“Exceptional service and quality. Will definitely return!”</p><h3 class='text-lg font-semibold'>John Smith</h3><span class='text-sm text-gray-500'>Founder, Company B</span></div><div class='bg-white p-6 rounded-lg shadow-lg'><p class='text-gray-600 mb-4'>“A fantastic experience from start to finish.”</p><h3 class='text-lg font-semibold'>Alice Johnson</h3><span class='text-sm text-gray-500'>Manager, Company C</span></div></div></div></section>
```

### Example 2: Highlighted Testimonial Cards

**When To Use**: This design is effective when you want to emphasize a standout testimonial, ideal for drawing attention on promotional pages.

**Why It Works**: The highlighted card uses a different background color and larger font sizes to create a focal point, while maintaining a cohesive design with the other testimonials.

**Tailwind Notes**:
- Highlighting one card with a different background enhances visual hierarchy.
- Using larger text for the standout testimonial makes it more memorable.
- Consistent spacing ensures that the layout remains balanced.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Testimonials</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white p-6 rounded-lg shadow-lg'><p class='text-gray-600 mb-4'>“Absolutely fantastic! Exceeded my expectations.”</p><h3 class='text-lg font-semibold'>Mark Lee</h3><span class='text-sm text-gray-500'>Director, Company D</span></div><div class='bg-blue-100 p-6 rounded-lg shadow-lg'><p class='text-gray-800 mb-4 text-lg'>“The best investment I've made this year!”</p><h3 class='text-xl font-bold'>Sarah Connor</h3><span class='text-sm text-gray-700'>Entrepreneur</span></div><div class='bg-white p-6 rounded-lg shadow-lg'><p class='text-gray-600 mb-4'>“Highly recommend! Will use again.”</p><h3 class='text-lg font-semibold'>Tom Hardy</h3><span class='text-sm text-gray-500'>Manager, Company E</span></div></div></div></section>
```

## `testimonials` / `carousel`

### Example 1: Simple Testimonials Carousel

**When To Use**: When you want to showcase customer feedback in a clean and straightforward manner, ideal for small businesses or service providers.

**Why It Works**: The design emphasizes readability and draws attention to customer quotes, enhancing trust and credibility. The use of contrasting colors for the CTA button makes it stand out.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Includes ample padding for a polished look.
- Text color and background contrast for readability.

```html
<section class='bg-gray-50 py-12'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-6'>What Our Customers Say</h2><div class='flex overflow-x-auto space-x-4'><div class='bg-white rounded-lg shadow-lg p-6 flex-shrink-0 w-80'><p class='text-gray-700 mb-4'>“This service has transformed my business!”</p><h3 class='font-semibold text-lg'>John Doe</h3><p class='text-gray-500'>CEO, Example Co.</p></div><div class='bg-white rounded-lg shadow-lg p-6 flex-shrink-0 w-80'><p class='text-gray-700 mb-4'>“I couldn't be happier with the results.”</p><h3 class='font-semibold text-lg'>Jane Smith</h3><p class='text-gray-500'>Founder, Another Co.</p></div><div class='bg-white rounded-lg shadow-lg p-6 flex-shrink-0 w-80'><p class='text-gray-700 mb-4'>“A game changer for my marketing strategy.”</p><h3 class='font-semibold text-lg'>Sam Wilson</h3><p class='text-gray-500'>Marketing Director, Business Inc.</p></div></div><a href='#' class='mt-6 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Get Started</a></div></section>
```

### Example 2: Elegant Testimonials Carousel with Images

**When To Use**: Ideal for brands that want to add a personal touch by including customer images, enhancing relatability and visual interest.

**Why It Works**: Incorporating images creates a stronger emotional connection and adds authenticity. The layout is responsive, ensuring it looks great on all devices.

**Tailwind Notes**:
- Image inclusion adds visual hierarchy.
- Flexbox ensures responsive behavior.
- Consistent spacing between items for a clean look.

```html
<section class='bg-white py-12'><div class='container mx-auto px-4'><h2 class='text-4xl font-bold text-center mb-8'>Hear from Our Happy Customers</h2><div class='flex overflow-x-auto space-x-6'><div class='bg-gray-100 rounded-lg shadow-md p-6 flex-shrink-0 w-72'><img src='customer1.jpg' alt='Customer 1' class='rounded-full w-16 h-16 mb-4'><p class='text-gray-800 mb-4'>“Absolutely fantastic experience!”</p><h3 class='font-semibold text-lg'>Alice Johnson</h3><p class='text-gray-600'>Owner, Local Shop</p></div><div class='bg-gray-100 rounded-lg shadow-md p-6 flex-shrink-0 w-72'><img src='customer2.jpg' alt='Customer 2' class='rounded-full w-16 h-16 mb-4'><p class='text-gray-800 mb-4'>“I highly recommend this service!”</p><h3 class='font-semibold text-lg'>Bob Lee</h3><p class='text-gray-600'>Entrepreneur</p></div><div class='bg-gray-100 rounded-lg shadow-md p-6 flex-shrink-0 w-72'><img src='customer3.jpg' alt='Customer 3' class='rounded-full w-16 h-16 mb-4'><p class='text-gray-800 mb-4'>“The best decision I ever made!”</p><h3 class='font-semibold text-lg'>Cathy Green</h3><p class='text-gray-600'>Freelancer</p></div></div><a href='#' class='mt-6 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition'>Join Us Today</a></div></section>
```

## `testimonials` / `avatars`

### Example 1: Grid of Testimonials with Avatars

**When To Use**: Use this layout when you want to showcase multiple testimonials in a visually appealing grid format, ideal for highlighting customer satisfaction.

**Why It Works**: The grid layout allows for easy scanning of testimonials, while the use of avatars adds a personal touch. The spacing and typography guide the user's eye, making it easy to read and engage with each testimonial.

**Tailwind Notes**:
- Uses a responsive grid layout for adaptability across devices.
- Employs consistent padding and margin for a polished look.
- Utilizes contrasting colors to emphasize the CTA.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>What Our Customers Say</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6'><img class='w-16 h-16 rounded-full mx-auto mb-4' src='avatar1.jpg' alt='Customer 1'><p class='text-gray-700 italic'>“This product changed my life!”</p><p class='text-gray-500 mt-2'>- Customer 1</p></div><div class='bg-white shadow-lg rounded-lg p-6'><img class='w-16 h-16 rounded-full mx-auto mb-4' src='avatar2.jpg' alt='Customer 2'><p class='text-gray-700 italic'>“Excellent service and support!”</p><p class='text-gray-500 mt-2'>- Customer 2</p></div><div class='bg-white shadow-lg rounded-lg p-6'><img class='w-16 h-16 rounded-full mx-auto mb-4' src='avatar3.jpg' alt='Customer 3'><p class='text-gray-700 italic'>“Highly recommend to everyone!”</p><p class='text-gray-500 mt-2'>- Customer 3</p></div></div></div></section>
```

### Example 2: Single Testimonial Highlight with Avatar

**When To Use**: Use this layout when you want to feature a standout testimonial prominently, perfect for landing pages aiming to convert visitors.

**Why It Works**: Focusing on a single testimonial with a large avatar draws attention and creates a personal connection. The clear call-to-action encourages users to engage further.

**Tailwind Notes**:
- Utilizes a full-width layout for maximum impact.
- Incorporates larger typography for emphasis.
- Ensures high contrast between text and background for readability.

```html
<section class='py-12 bg-white'><div class='container mx-auto text-center'><img class='w-24 h-24 rounded-full mx-auto mb-4' src='avatar.jpg' alt='Customer'><h3 class='text-2xl font-semibold mb-2'>“Amazing experience with this product!”</h3><p class='text-gray-600 italic mb-4'>- Happy Customer</p><a href='#' class='bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300'>Get Started</a></div></section>
```

## `testimonials` / `single-highlight`

### Example 1: Highlighted Testimonial with Author Image

**When To Use**: Use this layout when you want to emphasize a single testimonial that includes an author image, creating a personal connection.

**Why It Works**: The combination of a large image, clear typography, and ample white space draws attention to the testimonial, making it feel authentic and relatable.

**Tailwind Notes**:
- Utilizes flexbox for alignment and spacing.
- High contrast between text and background enhances readability.
- Responsive design ensures accessibility on all devices.

```html
<section class='bg-gray-100 py-12'><div class='max-w-4xl mx-auto text-center'><div class='flex flex-col items-center'><img class='w-24 h-24 rounded-full mb-4' src='author-image.jpg' alt='Author Name'><blockquote class='text-lg italic text-gray-700 mb-4'>“This product changed my life! I can't imagine my routine without it.”</blockquote><cite class='text-sm font-semibold text-gray-900'>- Author Name, <span class='text-gray-600'>Position, Company</span></cite></div></div></section>
```

### Example 2: Single Highlight with Background Color and CTA

**When To Use**: Ideal for featuring a powerful testimonial that also encourages users to take action, such as signing up or learning more.

**Why It Works**: The contrasting background color draws attention to the testimonial, while the clear call-to-action button encourages user interaction.

**Tailwind Notes**:
- Bold background color creates a focal point.
- CTA button styled for visibility and interaction.
- Generous padding ensures the section feels spacious.

```html
<section class='bg-blue-500 py-16'><div class='max-w-3xl mx-auto text-center text-white'><blockquote class='text-xl italic mb-6'>“The service was exceptional, and I would recommend it to anyone!”</blockquote><cite class='text-lg font-semibold mb-4'>- Happy Customer</cite><a href='#' class='bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-200'>Get Started</a></div></section>
```

### Example 3: Minimalist Single Testimonial with Quote Icon

**When To Use**: Use this layout for a clean, modern aesthetic that emphasizes simplicity while still showcasing a powerful testimonial.

**Why It Works**: The minimalist design reduces distractions, and the quote icon adds a visual element that enhances the testimonial's impact.

**Tailwind Notes**:
- Minimalist approach keeps focus on the text.
- Subtle icon adds character without overwhelming.
- Responsive typography scales well on different devices.

```html
<section class='bg-white py-12 shadow-md'><div class='max-w-2xl mx-auto text-center'><div class='flex justify-center mb-4'><svg class='w-8 h-8 text-gray-400' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0C4.48 0 0 4.48 0 10c0 5.52 4.48 10 10 10s10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/></svg></div><blockquote class='text-lg italic text-gray-800 mb-4'>“Incredible experience! The team was professional and delivered on time.”</blockquote><cite class='text-sm font-semibold text-gray-600'>- Satisfied Client</cite></div></section>
```

## `testimonials` / `grid`

### Example 1: Two-Column Testimonial Grid

**When To Use**: When you want to showcase multiple testimonials in a clean and organized layout, ideal for highlighting customer feedback on a landing page.

**Why It Works**: The two-column layout provides a balanced visual flow, allowing users to easily read and digest testimonials. The use of contrasting background colors helps to differentiate the section, while ample spacing ensures clarity and focus on each testimonial.

**Tailwind Notes**:
- Utilizes a responsive grid layout for varying screen sizes.
- Incorporates consistent padding and margin for a polished look.
- Emphasizes quotes with larger text and distinct styling.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-12'>What Our Customers Say</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-8'><div class='bg-white p-6 rounded-lg shadow-lg'><p class='text-lg italic text-gray-600'>“This product changed my life! Highly recommend to everyone.”</p><p class='mt-4 font-semibold'>- Jane Doe</p></div><div class='bg-white p-6 rounded-lg shadow-lg'><p class='text-lg italic text-gray-600'>“Exceptional service and quality. Will definitely be back!”</p><p class='mt-4 font-semibold'>- John Smith</p></div></div></div></section>
```

### Example 2: Three-Column Testimonial Grid with Icons

**When To Use**: Best for showcasing a variety of testimonials from different users, especially when you want to incorporate visual elements like icons to enhance engagement.

**Why It Works**: The three-column layout maximizes space and allows for a diverse presentation of testimonials. Icons add a visual cue that draws attention, while the consistent card design maintains a cohesive look. The use of hover effects enhances interactivity.

**Tailwind Notes**:
- Responsive design adapts to smaller screens by stacking columns.
- Hover effects on cards improve user engagement.
- Icons provide a visual representation of each testimonial.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-12'>Hear From Our Clients</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow'><div class='flex items-center mb-4'><img src='icon1.png' alt='Client Icon' class='w-10 h-10 mr-2'><h3 class='text-xl font-semibold'>Jane Doe</h3></div><p class='text-gray-700'>“Amazing experience! The team was incredibly helpful.”</p></div><div class='bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow'><div class='flex items-center mb-4'><img src='icon2.png' alt='Client Icon' class='w-10 h-10 mr-2'><h3 class='text-xl font-semibold'>John Smith</h3></div><p class='text-gray-700'>“Top-notch quality and service. Highly recommend!”</p></div><div class='bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow'><div class='flex items-center mb-4'><img src='icon3.png' alt='Client Icon' class='w-10 h-10 mr-2'><h3 class='text-xl font-semibold'>Emily Johnson</h3></div><p class='text-gray-700'>“I loved the product! Will buy again.”</p></div></div></div></section>
```

## `testimonials` / `masonry`

### Example 1: Masonry Testimonials with Image and Quote

**When To Use**: When you want to showcase customer feedback with a visual element, such as a profile image, to add authenticity.

**Why It Works**: Utilizing a masonry layout creates a visually engaging experience that keeps users scrolling. The use of images alongside testimonials adds a personal touch, enhancing credibility.

**Tailwind Notes**:
- Utilizes grid layout for masonry effect with gap for spacing.
- Images are styled with rounded corners for a softer look.
- Text contrast is high for readability, and CTAs are emphasized with colors.

```html
<section class='py-12 bg-gray-50'>
  <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <h2 class='text-3xl font-bold text-center text-gray-800 mb-8'>What Our Customers Say</h2>
    <div class='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
      <div class='bg-white shadow-lg rounded-lg p-6 flex flex-col'>
        <img src='customer1.jpg' alt='Customer 1' class='w-16 h-16 rounded-full mb-4'>
        <p class='text-gray-600 italic flex-grow'>"This product changed my life! Highly recommend it to everyone."</p>
        <span class='mt-4 font-semibold text-gray-800'>- Jane Doe</span>
      </div>
      <div class='bg-white shadow-lg rounded-lg p-6 flex flex-col'>
        <img src='customer2.jpg' alt='Customer 2' class='w-16 h-16 rounded-full mb-4'>
        <p class='text-gray-600 italic flex-grow'>"Fantastic service and amazing quality! Will buy again."</p>
        <span class='mt-4 font-semibold text-gray-800'>- John Smith</span>
      </div>
      <div class='bg-white shadow-lg rounded-lg p-6 flex flex-col'>
        <img src='customer3.jpg' alt='Customer 3' class='w-16 h-16 rounded-full mb-4'>
        <p class='text-gray-600 italic flex-grow'>"A wonderful experience from start to finish!"</p>
        <span class='mt-4 font-semibold text-gray-800'>- Emily Johnson</span>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Masonry Testimonials with Colorful Backgrounds

**When To Use**: When you want to create a vibrant and dynamic look while showcasing diverse testimonials that stand out.

**Why It Works**: The use of distinct background colors for each testimonial card draws attention and creates a lively atmosphere, while the masonry layout maintains a structured appearance.

**Tailwind Notes**:
- Background colors are varied for visual interest.
- Text colors are chosen for contrast against backgrounds.
- Responsive design ensures cards stack nicely on smaller screens.

```html
<section class='py-12'>
  <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <h2 class='text-3xl font-bold text-center text-gray-800 mb-8'>Hear From Our Clients</h2>
    <div class='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
      <div class='bg-blue-500 text-white shadow-lg rounded-lg p-6 flex flex-col'>
        <p class='italic flex-grow'>"Absolutely love this! The quality is top-notch."</p>
        <span class='mt-4 font-semibold'>- Sarah Connor</span>
      </div>
      <div class='bg-green-500 text-white shadow-lg rounded-lg p-6 flex flex-col'>
        <p class='italic flex-grow'>"A game changer for my business. Highly recommend!"</p>
        <span class='mt-4 font-semibold'>- Kyle Reese</span>
      </div>
      <div class='bg-red-500 text-white shadow-lg rounded-lg p-6 flex flex-col'>
        <p class='italic flex-grow'>"Exceptional service and support! Will return!"</p>
        <span class='mt-4 font-semibold'>- T-800</span>
      </div>
    </div>
  </div>
</section>
```

## `customer-stories` / `cards`

### Example 1: Customer Testimonials Grid

**When To Use**: Use this layout when showcasing multiple customer testimonials in a visually appealing grid format.

**Why It Works**: The grid layout allows for easy scanning, while the card design draws attention to each testimonial. The use of consistent spacing and typography enhances readability and focus on the content.

**Tailwind Notes**:
- Utilizes grid layout for responsive design.
- Consistent padding and margin for spacing.
- Contrast in background and text colors for readability.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>What Our Customers Say</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6'><p class='text-gray-700 italic'>&quot;This product changed my life!&quot;</p><h3 class='mt-4 text-lg font-semibold'>Jane Doe</h3><p class='text-gray-500'>CEO, Company A</p></div><div class='bg-white shadow-lg rounded-lg p-6'><p class='text-gray-700 italic'>&quot;Exceptional service and quality!&quot;</p><h3 class='mt-4 text-lg font-semibold'>John Smith</h3><p class='text-gray-500'>CTO, Company B</p></div><div class='bg-white shadow-lg rounded-lg p-6'><p class='text-gray-700 italic'>&quot;I highly recommend this to everyone!&quot;</p><h3 class='mt-4 text-lg font-semibold'>Alice Johnson</h3><p class='text-gray-500'>Founder, Company C</p></div></div></div></section>
```

### Example 2: Highlighted Customer Stories

**When To Use**: Use this layout to emphasize a few standout customer stories with larger cards and images.

**Why It Works**: By using larger cards with images, this design captures attention and provides a more engaging experience. The background color and shadow effects create a polished look, making the stories feel more important.

**Tailwind Notes**:
- Larger cards for emphasis on key stories.
- Images enhance visual interest.
- Sufficient spacing and contrast to separate elements.

```html
<section class='py-16 bg-blue-50'><div class='container mx-auto'><h2 class='text-4xl font-bold text-center mb-10'>Our Success Stories</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white shadow-xl rounded-lg overflow-hidden'><img src='customer1.jpg' alt='Customer 1' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold'>Transforming Business with Our Solution</h3><p class='text-gray-600 mt-2'>How Company A increased efficiency by 50%.</p><a href='#' class='inline-block mt-4 text-blue-600 font-semibold'>Read More</a></div></div><div class='bg-white shadow-xl rounded-lg overflow-hidden'><img src='customer2.jpg' alt='Customer 2' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold'>Achieving New Heights</h3><p class='text-gray-600 mt-2'>The journey of Company B to success.</p><a href='#' class='inline-block mt-4 text-blue-600 font-semibold'>Read More</a></div></div><div class='bg-white shadow-xl rounded-lg overflow-hidden'><img src='customer3.jpg' alt='Customer 3' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold'>Innovating for the Future</h3><p class='text-gray-600 mt-2'>How Company C is leading the way.</p><a href='#' class='inline-block mt-4 text-blue-600 font-semibold'>Read More</a></div></div></div></div></section>
```

## `customer-stories` / `featured-story`

### Example 1: Single Featured Story with Emphasis

**When To Use**: Use this layout when you want to highlight a single customer story prominently on the page, making it the focal point.

**Why It Works**: The large hero image and bold typography draw attention to the story, while the clear CTA encourages engagement. The layout is clean and visually appealing, ensuring the story stands out.

**Tailwind Notes**:
- Large hero image for visual impact.
- Bold typography for the title and quote to create emphasis.
- Clear contrasting CTA button to prompt action.

```html
<section class='bg-white py-16 px-4 sm:px-6 lg:px-8'>
  <div class='max-w-3xl mx-auto text-center'>
    <h2 class='text-3xl font-extrabold text-gray-900'>Customer Success Story</h2>
    <div class='mt-4'>
      <img src='customer-story.jpg' alt='Customer Story' class='w-full h-64 object-cover rounded-lg shadow-lg'>
    </div>
    <blockquote class='mt-6 text-xl italic text-gray-500'>
      “This product changed our business for the better!”
    </blockquote>
    <p class='mt-4 text-gray-700'>
      - Jane Doe, CEO of Example Inc.
    </p>
    <a href='/case-studies' class='mt-8 inline-block px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700'>
      Read More Stories
    </a>
  </div>
</section>
```

### Example 2: Grid of Featured Stories

**When To Use**: Use this layout when showcasing multiple customer stories to provide social proof and highlight diverse experiences.

**Why It Works**: The grid layout allows for multiple stories to be displayed in an organized manner, making it easy for users to browse. Each card has enough spacing and visual hierarchy to stand out while maintaining a cohesive look.

**Tailwind Notes**:
- Grid layout for responsive design and easy navigation.
- Consistent card styling with shadows and rounded corners for a polished look.
- Hover effects on cards to enhance interactivity.

```html
<section class='bg-gray-50 py-16 px-4 sm:px-6 lg:px-8'>
  <div class='max-w-6xl mx-auto'>
    <h2 class='text-3xl font-extrabold text-gray-900 text-center'>What Our Customers Say</h2>
    <div class='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div class='bg-white rounded-lg shadow-lg p-6'>
        <img src='customer1.jpg' alt='Customer 1' class='w-full h-32 object-cover rounded-md'>
        <h3 class='mt-4 text-xl font-semibold text-gray-800'>John Smith</h3>
        <p class='mt-2 text-gray-600'>“This service helped us achieve our goals.”</p>
      </div>
      <div class='bg-white rounded-lg shadow-lg p-6'>
        <img src='customer2.jpg' alt='Customer 2' class='w-full h-32 object-cover rounded-md'>
        <h3 class='mt-4 text-xl font-semibold text-gray-800'>Emily Johnson</h3>
        <p class='mt-2 text-gray-600'>“I can't imagine our workflow without it!”</p>
      </div>
      <div class='bg-white rounded-lg shadow-lg p-6'>
        <img src='customer3.jpg' alt='Customer 3' class='w-full h-32 object-cover rounded-md'>
        <h3 class='mt-4 text-xl font-semibold text-gray-800'>Michael Brown</h3>
        <p class='mt-2 text-gray-600'>“A game changer for our team!”</p>
      </div>
    </div>
  </div>
</section>
```

## `customer-stories` / `stacked`

### Example 1: Customer Testimonials with Images

**When To Use**: Use this example when you want to showcase customer stories visually alongside their testimonials, creating a personal connection.

**Why It Works**: The combination of images and text provides a strong visual appeal, while the clear hierarchy and spacing enhance readability. The use of contrasting colors draws attention to the CTAs.

**Tailwind Notes**:
- Flexbox for alignment and spacing.
- Responsive design for mobile and desktop views.
- Consistent padding and margins for visual balance.

```html
<section class='py-12 bg-gray-50'>
  <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <h2 class='text-3xl font-bold text-center text-gray-800 mb-8'>What Our Customers Say</h2>
    <div class='grid grid-cols-1 md:grid-cols-2 gap-8'>
      <div class='bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105'>
        <img class='w-16 h-16 rounded-full mb-4' src='customer1.jpg' alt='Customer 1'>
        <p class='text-gray-600 mb-4'>“This product changed my life! I can't imagine going back.”</p>
        <p class='font-semibold text-gray-800'>- Jane Doe</p>
      </div>
      <div class='bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105'>
        <img class='w-16 h-16 rounded-full mb-4' src='customer2.jpg' alt='Customer 2'>
        <p class='text-gray-600 mb-4'>“Exceptional service and quality. Highly recommend!”</p>
        <p class='font-semibold text-gray-800'>- John Smith</p>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Customer Stories in a Card Layout

**When To Use**: Ideal for showcasing multiple customer stories in a visually appealing card format, suitable for landing pages that require a clean, organized layout.

**Why It Works**: The card layout allows for easy scanning of customer stories, with consistent styling that emphasizes each story. The use of hover effects enhances engagement, while the CTA button encourages action.

**Tailwind Notes**:
- Grid layout for responsive design.
- Hover effects to increase interactivity.
- Clear CTA buttons to drive conversions.

```html
<section class='py-12 bg-white'>
  <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <h2 class='text-3xl font-bold text-center text-gray-800 mb-10'>Hear From Our Happy Customers</h2>
    <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
      <div class='bg-gray-100 p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg'>
        <h3 class='text-lg font-semibold text-gray-800 mb-2'>Customer A</h3>
        <p class='text-gray-700 mb-4'>“Absolutely fantastic experience! I will definitely come back.”</p>
        <a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Read More</a>
      </div>
      <div class='bg-gray-100 p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg'>
        <h3 class='text-lg font-semibold text-gray-800 mb-2'>Customer B</h3>
        <p class='text-gray-700 mb-4'>“The best investment I've made this year!”</p>
        <a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Read More</a>
      </div>
      <div class='bg-gray-100 p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg'>
        <h3 class='text-lg font-semibold text-gray-800 mb-2'>Customer C</h3>
        <p class='text-gray-700 mb-4'>“I can't recommend this enough! Truly a game changer.”</p>
        <a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Read More</a>
      </div>
    </div>
  </div>
</section>
```

## `case-study-preview` / `grid`

### Example 1: Two-Column Case Study Grid

**When To Use**: Use this layout when showcasing multiple case studies with a focus on visual impact and easy navigation.

**Why It Works**: This layout provides a clear visual hierarchy with ample whitespace, allowing users to focus on each case study. The contrasting colors for CTAs enhance clickability, and the responsive grid adapts well to different screen sizes.

**Tailwind Notes**:
- Flexbox grid for responsive layout.
- Consistent spacing between items for a polished look.
- Hover effects to enhance interactivity.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Case Studies</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-6'><div class='bg-white shadow-lg rounded-lg overflow-hidden'><img src='case-study1.jpg' alt='Case Study 1' class='w-full h-48 object-cover'/><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Case Study Title 1</h3><p class='text-gray-700 mb-4'>Brief description of the case study highlighting key achievements.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Read More</a></div></div><div class='bg-white shadow-lg rounded-lg overflow-hidden'><img src='case-study2.jpg' alt='Case Study 2' class='w-full h-48 object-cover'/><div class='p-6'><h3 class='text-xl font-semibold mb-2'>Case Study Title 2</h3><p class='text-gray-700 mb-4'>Brief description of the case study highlighting key achievements.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Read More</a></div></div></div></div></section>
```

### Example 2: Three-Column Case Study Grid

**When To Use**: Ideal for showcasing a larger number of case studies in a compact format, suitable for landing pages with limited vertical space.

**Why It Works**: The three-column layout maximizes screen real estate while maintaining readability. The use of cards with shadows creates depth, and the consistent typography guides users' attention effectively.

**Tailwind Notes**:
- Responsive grid with three columns on larger screens.
- Hover effects for cards to enhance user engagement.
- Clear CTA buttons increase conversion chances.

```html
<section class='py-12 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Explore Our Work</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-gray-100 shadow-md rounded-lg overflow-hidden'><img src='case-study3.jpg' alt='Case Study 3' class='w-full h-48 object-cover'/><div class='p-5'><h3 class='text-lg font-semibold mb-2'>Case Study Title 3</h3><p class='text-gray-600 mb-3'>A brief overview of the project and its impact.</p><a href='#' class='inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition'>Learn More</a></div></div><div class='bg-gray-100 shadow-md rounded-lg overflow-hidden'><img src='case-study4.jpg' alt='Case Study 4' class='w-full h-48 object-cover'/><div class='p-5'><h3 class='text-lg font-semibold mb-2'>Case Study Title 4</h3><p class='text-gray-600 mb-3'>A brief overview of the project and its impact.</p><a href='#' class='inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition'>Learn More</a></div></div><div class='bg-gray-100 shadow-md rounded-lg overflow-hidden'><img src='case-study5.jpg' alt='Case Study 5' class='w-full h-48 object-cover'/><div class='p-5'><h3 class='text-lg font-semibold mb-2'>Case Study Title 5</h3><p class='text-gray-600 mb-3'>A brief overview of the project and its impact.</p><a href='#' class='inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition'>Learn More</a></div></div></div></div></section>
```

## `case-study-preview` / `spotlight`

### Example 1: Highlighted Case Studies Grid

**When To Use**: Use this layout when you want to showcase multiple case studies in a grid format, emphasizing the most impactful projects.

**Why It Works**: The grid layout allows for quick scanning of case studies, while the use of contrasting backgrounds and ample spacing creates a clear visual hierarchy. The call-to-action buttons are prominent, encouraging users to engage.

**Tailwind Notes**:
- Use of grid layout for responsive design.
- High contrast background colors to differentiate sections.
- Consistent spacing for visual balance.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Success Stories</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white shadow-lg rounded-lg overflow-hidden'><img src='case-study-1.jpg' alt='Case Study 1' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold'>Case Study Title 1</h3><p class='text-gray-600 mb-4'>Brief description of the project highlighting key achievements.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Read More</a></div></div><div class='bg-white shadow-lg rounded-lg overflow-hidden'><img src='case-study-2.jpg' alt='Case Study 2' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold'>Case Study Title 2</h3><p class='text-gray-600 mb-4'>Brief description of the project highlighting key achievements.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Read More</a></div></div><div class='bg-white shadow-lg rounded-lg overflow-hidden'><img src='case-study-3.jpg' alt='Case Study 3' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold'>Case Study Title 3</h3><p class='text-gray-600 mb-4'>Brief description of the project highlighting key achievements.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Read More</a></div></div></div></div></section>
```

### Example 2: Featured Case Study with Image and Text

**When To Use**: Ideal for highlighting a single, significant case study with a combination of visual and textual elements to draw attention.

**Why It Works**: The use of a large image alongside a compelling narrative creates an engaging focal point. The layout is responsive, ensuring a good experience on all devices, while the CTA is bold and clear.

**Tailwind Notes**:
- Flexbox layout for side-by-side alignment.
- Large image for visual impact.
- Emphasis on the CTA with color and size.

```html
<section class='py-16 bg-white'><div class='container mx-auto flex flex-col md:flex-row items-center'><div class='md:w-1/2'><img src='featured-case-study.jpg' alt='Featured Case Study' class='w-full h-auto rounded-lg shadow-lg'></div><div class='md:w-1/2 md:pl-8'><h2 class='text-3xl font-bold mb-4'>Spotlight on Our Latest Project</h2><p class='text-gray-700 mb-6'>An in-depth look at how we transformed our client's business through innovative solutions and strategic planning.</p><a href='#' class='inline-block bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700'>Discover the Full Story</a></div></div></section>
```

## `case-study-preview` / `before-after`

### Example 1: Before and After Comparison with Visual Impact

**When To Use**: Use this layout to showcase the transformation achieved through your product or service, emphasizing the stark contrast between the before and after states.

**Why It Works**: The use of side-by-side images creates a direct visual comparison, while the clear headings and CTAs guide the user’s attention to the key benefits. The responsive design ensures that the section looks great on all devices.

**Tailwind Notes**:
- Flexbox is used for layout to ensure images are side by side.
- Use of shadow and rounded corners adds a polished look.
- Responsive utility classes ensure good visibility on mobile.

```html
<section class="py-12 bg-gray-100">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Transformations That Matter</h2>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-1 bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold mb-4">Before</h3>
        <img src="before-image.jpg" alt="Before Transformation" class="w-full rounded-lg mb-4">
        <p class="text-gray-600">Description of the situation before using the product.</p>
      </div>
      <div class="flex-1 bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold mb-4">After</h3>
        <img src="after-image.jpg" alt="After Transformation" class="w-full rounded-lg mb-4">
        <p class="text-gray-600">Description of the improvements and benefits achieved.</p>
      </div>
    </div>
    <div class="text-center mt-8">
      <a href="#" class="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition">See More Case Studies</a>
    </div>
  </div>
</section>
```

### Example 2: Before and After with Testimonials

**When To Use**: Ideal for highlighting user experiences alongside visual transformations, providing social proof to potential customers.

**Why It Works**: This layout combines visual evidence with user testimonials, enhancing credibility. The use of contrasting colors for the testimonials section draws attention and encourages engagement.

**Tailwind Notes**:
- The grid layout allows for a balanced presentation of images and testimonials.
- Text contrast ensures readability and emphasis on key messages.
- Spacing between elements enhances clarity and focus.

```html
<section class="py-12 bg-white">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Real Results from Real Users</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-gray-50 p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-4">Before</h3>
        <img src="before-image.jpg" alt="Before Transformation" class="w-full rounded-lg mb-4">
        <p class="text-gray-600">Description of the situation before using the product.</p>
      </div>
      <div class="bg-gray-50 p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-4">After</h3>
        <img src="after-image.jpg" alt="After Transformation" class="w-full rounded-lg mb-4">
        <p class="text-gray-600">Description of the improvements and benefits achieved.</p>
      </div>
    </div>
    <div class="mt-8">
      <h3 class="text-2xl font-bold text-center mb-4">What Our Clients Say</h3>
      <div class="bg-blue-100 p-6 rounded-lg shadow-lg">
        <p class="text-lg italic">“This product changed my life! I can't believe the difference it made.”</p>
        <p class="text-right text-gray-700 mt-2">- Happy Customer</p>
      </div>
    </div>
    <div class="text-center mt-8">
      <a href="#" class="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition">Explore More Success Stories</a>
    </div>
  </div>
</section>
```

## `results` / `stat-bar`

### Example 1: Performance Metrics Overview

**When To Use**: When you want to showcase key performance indicators in a visually engaging way, suitable for a landing page.

**Why It Works**: The layout emphasizes clarity and allows for quick comprehension of important metrics, with strong contrast and intentional spacing enhancing readability.

**Tailwind Notes**:
- Utilizes flexbox for responsive alignment.
- Incorporates background color for section contrast.
- Includes utility classes for spacing and typography to create a polished look.

```html
<section class='bg-gray-100 py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Performance Metrics</h2><div class='flex flex-wrap justify-between'><div class='bg-white shadow-lg rounded-lg p-6 flex-1 m-2'><h3 class='text-xl font-semibold text-gray-800'>Users</h3><p class='text-4xl font-bold text-blue-600'>1,200</p></div><div class='bg-white shadow-lg rounded-lg p-6 flex-1 m-2'><h3 class='text-xl font-semibold text-gray-800'>Projects Completed</h3><p class='text-4xl font-bold text-blue-600'>350</p></div><div class='bg-white shadow-lg rounded-lg p-6 flex-1 m-2'><h3 class='text-xl font-semibold text-gray-800'>Satisfaction Rate</h3><p class='text-4xl font-bold text-blue-600'>98%</p></div></div></div></section>
```

### Example 2: Key Achievements Showcase

**When To Use**: Ideal for highlighting achievements or milestones in a visually appealing format, perfect for marketing sites.

**Why It Works**: The use of contrasting colors and clear typography draws attention to each achievement, while the responsive grid layout ensures a seamless experience on all devices.

**Tailwind Notes**:
- Employs grid layout for better organization of stats.
- Utilizes hover effects for interactive engagement.
- Incorporates ample padding and margins for a clean look.

```html
<section class='bg-white py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Key Achievements</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-blue-500 text-white rounded-lg p-6 text-center'><h3 class='text-xl font-semibold'>Total Revenue</h3><p class='text-3xl font-bold'>€2M</p></div><div class='bg-green-500 text-white rounded-lg p-6 text-center'><h3 class='text-xl font-semibold'>Clients Served</h3><p class='text-3xl font-bold'>500+</p></div><div class='bg-red-500 text-white rounded-lg p-6 text-center'><h3 class='text-xl font-semibold'>Awards Won</h3><p class='text-3xl font-bold'>15</p></div></div></div></section>
```

## `results` / `metric-cards`

### Example 1: Performance Metrics Overview

**When To Use**: Use this layout to present key performance indicators in a visually appealing manner on a marketing site.

**Why It Works**: The use of a grid layout with distinct card styling creates a clear hierarchy and allows users to quickly digest information. The contrasting colors and ample whitespace enhance readability and focus on the metrics.

**Tailwind Notes**:
- Grid layout with responsive behavior for various screen sizes.
- Consistent use of color and spacing to create a cohesive look.
- Bold typography for metrics to draw attention.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Performance Metrics</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-md rounded-lg p-6 text-center'><h3 class='text-xl font-semibold text-gray-700'>Users</h3><p class='text-4xl font-bold text-blue-600'>1,234</p></div><div class='bg-white shadow-md rounded-lg p-6 text-center'><h3 class='text-xl font-semibold text-gray-700'>Sales</h3><p class='text-4xl font-bold text-blue-600'>$12,345</p></div><div class='bg-white shadow-md rounded-lg p-6 text-center'><h3 class='text-xl font-semibold text-gray-700'>Feedback Score</h3><p class='text-4xl font-bold text-blue-600'>4.8/5</p></div></div></div></section>
```

### Example 2: Key Achievements Showcase

**When To Use**: Ideal for highlighting significant achievements or milestones in a concise format, perfect for landing pages.

**Why It Works**: The card layout with icons and bold metrics draws attention and makes the achievements stand out. The use of subtle hover effects enhances interactivity, encouraging user engagement.

**Tailwind Notes**:
- Hover effects on cards to indicate interactivity.
- Use of icons to visually represent each metric.
- Consistent padding and margins for a polished appearance.

```html
<section class='py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Achievements</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><div class='flex items-center justify-center mb-4'><svg class='w-12 h-12 text-blue-600' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 00-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10S15.52 0 10 0zm0 18a8 8 0 110-16 8 8 0 010 16z'/></svg></div><h3 class='text-xl font-semibold text-gray-700'>Projects Completed</h3><p class='text-4xl font-bold text-blue-600'>150</p></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><div class='flex items-center justify-center mb-4'><svg class='w-12 h-12 text-blue-600' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 00-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10S15.52 0 10 0zm0 18a8 8 0 110-16 8 8 0 010 16z'/></svg></div><h3 class='text-xl font-semibold text-gray-700'>Happy Clients</h3><p class='text-4xl font-bold text-blue-600'>1,500</p></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><div class='flex items-center justify-center mb-4'><svg class='w-12 h-12 text-blue-600' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 00-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10S15.52 0 10 0zm0 18a8 8 0 110-16 8 8 0 010 16z'/></svg></div><h3 class='text-xl font-semibold text-gray-700'>Awards Won</h3><p class='text-4xl font-bold text-blue-600'>35</p></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><div class='flex items-center justify-center mb-4'><svg class='w-12 h-12 text-blue-600' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 00-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10S15.52 0 10 0zm0 18a8 8 0 110-16 8 8 0 010 16z'/></svg></div><h3 class='text-xl font-semibold text-gray-700'>Years of Experience</h3><p class='text-4xl font-bold text-blue-600'>10</p></div></div></div></section>
```

## `results` / `full-section`

### Example 1: Performance Metrics Showcase

**When To Use**: Use this layout to highlight key performance metrics or results that demonstrate the effectiveness of a product or service.

**Why It Works**: The clear typography and contrasting colors draw attention to the statistics, while the grid layout provides a clean, organized presentation. The prominent CTA encourages user engagement.

**Tailwind Notes**:
- Use of flexbox for responsive layout.
- Consistent spacing with padding and margin utilities.
- Contrast in colors for emphasis on stats and CTA.

```html
<section class="bg-white py-16 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto text-center">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Our Impact in Numbers</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h3 class="text-2xl font-bold text-blue-600">1,000+</h3>
        <p class="text-gray-700">Satisfied Customers</p>
      </div>
      <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h3 class="text-2xl font-bold text-blue-600">99%</h3>
        <p class="text-gray-700">Customer Satisfaction Rate</p>
      </div>
      <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h3 class="text-2xl font-bold text-blue-600">5,000+</h3>
        <p class="text-gray-700">Projects Completed</p>
      </div>
    </div>
    <a href="#" class="mt-8 inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">Get Started Today</a>
  </div>
</section>
```

### Example 2: Key Achievements Display

**When To Use**: Ideal for showcasing milestones or achievements that build credibility and trust with potential customers.

**Why It Works**: The use of icons alongside statistics enhances visual interest and makes the information digestible. The layout adapts well to different screen sizes, maintaining clarity and impact.

**Tailwind Notes**:
- Responsive design with grid layout for adaptability.
- Icons provide a visual cue that reinforces the message.
- Hover effects on CTA improve interactivity.

```html
<section class="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto text-center">
    <h2 class="text-4xl font-extrabold text-gray-900 mb-6">Our Achievements</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div class="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
        <img src="/path/to/icon1.svg" alt="Icon 1" class="h-12 w-12 mb-4">
        <h3 class="text-3xl font-bold text-blue-600">10M+</h3>
        <p class="text-gray-700">Downloads</p>
      </div>
      <div class="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
        <img src="/path/to/icon2.svg" alt="Icon 2" class="h-12 w-12 mb-4">
        <h3 class="text-3xl font-bold text-blue-600">200+</h3>
        <p class="text-gray-700">Partners</p>
      </div>
      <div class="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
        <img src="/path/to/icon3.svg" alt="Icon 3" class="h-12 w-12 mb-4">
        <h3 class="text-3xl font-bold text-blue-600">150+</h3>
        <p class="text-gray-700">Awards</p>
      </div>
    </div>
    <a href="#" class="mt-8 inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">See Our Work</a>
  </div>
</section>
```

## `results` / `contrast-strip`

### Example 1: Customer Success Stats

**When To Use**: When showcasing key metrics or achievements that highlight the effectiveness of a product or service.

**Why It Works**: The use of contrasting background colors and clear typography emphasizes the stats, making them stand out. The layout is responsive and maintains a clear hierarchy, guiding the viewer's attention to the most important information.

**Tailwind Notes**:
- bg-gray-800 provides a strong contrast against the white text.
- text-4xl for large, impactful numbers.
- flex for responsive layout adjustments.

```html
<section class='bg-gray-800 text-white py-12'><div class='container mx-auto px-4'><h2 class='text-center text-3xl font-bold mb-6'>Our Impact at a Glance</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-gray-700 p-6 rounded-lg shadow-lg text-center'><h3 class='text-4xl font-extrabold'>1M+</h3><p class='text-lg'>Happy Customers</p></div><div class='bg-gray-700 p-6 rounded-lg shadow-lg text-center'><h3 class='text-4xl font-extrabold'>500+</h3><p class='text-lg'>Projects Completed</p></div><div class='bg-gray-700 p-6 rounded-lg shadow-lg text-center'><h3 class='text-4xl font-extrabold'>99%</h3><p class='text-lg'>Customer Satisfaction</p></div></div></div></section>
```

### Example 2: Key Performance Metrics

**When To Use**: Ideal for highlighting significant performance metrics in a visually engaging way, especially in a marketing or product landing page.

**Why It Works**: The alternating background colors create visual interest while maintaining a clean and professional look. The use of larger text for stats and smaller text for descriptions creates a clear hierarchy, enhancing readability.

**Tailwind Notes**:
- bg-blue-600 and bg-blue-700 for alternating sections create a dynamic feel.
- text-5xl for strong emphasis on stats.
- rounded-lg for a polished card appearance.

```html
<section class='py-12'><div class='container mx-auto px-4'><h2 class='text-center text-3xl font-bold mb-6'>Performance Highlights</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-8'><div class='bg-blue-600 p-8 rounded-lg shadow-md text-white text-center'><h3 class='text-5xl font-extrabold'>10K+</h3><p class='text-lg'>Monthly Active Users</p></div><div class='bg-blue-700 p-8 rounded-lg shadow-md text-white text-center'><h3 class='text-5xl font-extrabold'>200%</h3><p class='text-lg'>Growth Rate</p></div></div></div></section>
```

## `before-after` / `slider`

### Example 1: Before and After Slider with Clear CTAs

**When To Use**: Use this slider to showcase transformations or improvements, ideal for services like home renovations or product upgrades.

**Why It Works**: The use of contrasting colors and clear typography draws attention to the changes, while the prominent CTAs encourage user interaction.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs contrasting colors for emphasis.
- Uses padding and margin for clear spacing.

```html
<section class='py-16 bg-gray-100'>
  <div class='container mx-auto text-center'>
    <h2 class='text-3xl font-bold mb-6'>Transform Your Space</h2>
    <div class='flex justify-center items-center mb-8'>
      <div class='relative w-full max-w-lg'>
        <div class='absolute inset-0 bg-blue-500 transition-all duration-500 ease-in-out transform hover:scale-105'></div>
        <div class='relative z-10'>
          <img src='before.jpg' alt='Before' class='w-full h-auto rounded-lg shadow-lg' />
          <img src='after.jpg' alt='After' class='w-full h-auto rounded-lg shadow-lg absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 hover:opacity-100' />
        </div>
      </div>
    </div>
    <p class='text-lg mb-4'>See the difference for yourself!</p>
    <a href='#' class='inline-block bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-300'>Get Started</a>
  </div>
</section>
```

### Example 2: Before-After Comparison with Testimonials

**When To Use**: Ideal for showcasing client results alongside testimonials, especially for services like fitness training or coaching.

**Why It Works**: Combining visual proof with social proof builds trust, while Tailwind’s spacing and typography create a clean, modern look.

**Tailwind Notes**:
- Uses grid layout for responsive design.
- Integrates testimonials to enhance credibility.
- Employs consistent padding for a polished appearance.

```html
<section class='py-16 bg-white'>
  <div class='container mx-auto text-center'>
    <h2 class='text-4xl font-bold mb-8'>Real Results from Our Clients</h2>
    <div class='grid grid-cols-1 md:grid-cols-2 gap-8'>
      <div class='relative'>
        <h3 class='text-xl font-semibold mb-4'>Before</h3>
        <img src='before.jpg' alt='Before' class='w-full h-auto rounded-lg shadow-lg' />
      </div>
      <div class='relative'>
        <h3 class='text-xl font-semibold mb-4'>After</h3>
        <img src='after.jpg' alt='After' class='w-full h-auto rounded-lg shadow-lg' />
      </div>
    </div>
    <div class='mt-12'>
      <p class='text-lg italic mb-4'>"I never thought I could achieve this!" - Happy Client</p>
      <a href='#' class='inline-block bg-green-600 text-white py-2 px-6 rounded-lg shadow hover:bg-green-700 transition duration-300'>Join Us Today</a>
    </div>
  </div>
</section>
```

## `before-after` / `side-by-side`

### Example 1: Before and After Comparison with Imagery

**When To Use**: Use this layout to showcase a transformation or improvement, such as a product upgrade or service enhancement.

**Why It Works**: The clear visual contrast between the 'before' and 'after' images draws attention and effectively communicates the value proposition. The use of whitespace and typography enhances readability and focus on key details.

**Tailwind Notes**:
- Flexbox layout for side-by-side alignment.
- Responsive design with stack on smaller screens.
- Emphasis on CTAs with contrasting colors.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto flex flex-col md:flex-row items-center justify-between'><div class='md:w-1/2 p-4'><h2 class='text-2xl font-bold text-gray-800 mb-4'>Before</h2><img src='before-image.jpg' alt='Before' class='rounded-lg shadow-lg'/><p class='mt-4 text-gray-600'>Description of the 'before' scenario.</p></div><div class='md:w-1/2 p-4'><h2 class='text-2xl font-bold text-gray-800 mb-4'>After</h2><img src='after-image.jpg' alt='After' class='rounded-lg shadow-lg'/><p class='mt-4 text-gray-600'>Description of the 'after' scenario.</p><a href='#' class='mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition'>See the Difference</a></div></div></section>
```

### Example 2: Service Improvement Showcase

**When To Use**: Ideal for demonstrating how a service has improved over time, appealing to prospective clients.

**Why It Works**: The side-by-side layout allows users to easily compare the benefits of the service before and after the enhancement. The use of cards with shadows creates a polished, professional look.

**Tailwind Notes**:
- Cards with shadows for depth.
- Consistent spacing for visual hierarchy.
- Responsive adjustments for mobile view.

```html
<section class='py-12 bg-white'><div class='container mx-auto flex flex-col md:flex-row items-center justify-between'><div class='md:w-1/2 p-4'><div class='bg-gray-100 rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold text-gray-800'>Before Improvement</h3><p class='mt-2 text-gray-600'>Details about the service before improvements.</p></div></div><div class='md:w-1/2 p-4'><div class='bg-blue-100 rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold text-gray-800'>After Improvement</h3><p class='mt-2 text-gray-600'>Details about the service after improvements.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition'>Learn More</a></div></div></div></section>
```

## `before-after` / `story-pair`

### Example 1: Transformation Journey

**When To Use**: Use this layout to showcase a customer's journey before and after using your product or service, highlighting impactful results.

**Why It Works**: The clear visual contrast between the 'before' and 'after' sections emphasizes the transformation, while the use of whitespace and typography guides the user's eye. The CTA is prominent, encouraging engagement.

**Tailwind Notes**:
- Flexbox layout for responsive design
- Consistent spacing for visual harmony
- Bold typography for emphasis on key messages
- High-contrast colors for CTA visibility

```html
<section class='py-12 bg-gray-50'>
  <div class='container mx-auto px-4'>
    <h2 class='text-3xl font-bold text-center mb-8'>See the Transformation</h2>
    <div class='flex flex-col md:flex-row justify-between items-stretch'>
      <div class='bg-white shadow-lg rounded-lg p-6 mb-6 md:mb-0 md:w-1/2'>
        <h3 class='text-xl font-semibold mb-4'>Before</h3>
        <p class='text-gray-700 mb-4'>Struggling with low engagement and high churn rates.</p>
        <img src='before.jpg' alt='Before Image' class='w-full rounded-lg'>
      </div>
      <div class='bg-white shadow-lg rounded-lg p-6 md:w-1/2'>
        <h3 class='text-xl font-semibold mb-4'>After</h3>
        <p class='text-gray-700 mb-4'>Achieved a 50% increase in engagement and retention!</p>
        <img src='after.jpg' alt='After Image' class='w-full rounded-lg'>
      </div>
    </div>
    <div class='text-center mt-8'>
      <a href='#' class='inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition'>Start Your Journey</a>
    </div>
  </div>
</section>
```

### Example 2: Client Success Stories

**When To Use**: Ideal for showcasing multiple client stories side by side, allowing potential customers to see the effectiveness of your service across various scenarios.

**Why It Works**: Using a grid layout allows for a clean presentation of multiple stories. Each card is distinct yet uniform, making it easy for users to compare before and after results. The use of rounded corners and shadows enhances the visual appeal.

**Tailwind Notes**:
- Grid layout for organized presentation
- Card design for individual stories
- Consistent use of colors for branding
- Responsive adjustments for mobile and desktop

```html
<section class='py-12 bg-gray-100'>
  <div class='container mx-auto px-4'>
    <h2 class='text-3xl font-bold text-center mb-8'>Client Success Stories</h2>
    <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div class='bg-white shadow-lg rounded-lg p-6'>
        <h3 class='text-xl font-semibold mb-4'>Before</h3>
        <p class='text-gray-700'>Client A struggled with...</p>
        <img src='client-a-before.jpg' alt='Client A Before' class='w-full rounded-lg mb-4'>
        <h3 class='text-xl font-semibold mb-4'>After</h3>
        <p class='text-gray-700'>After using our service...</p>
        <img src='client-a-after.jpg' alt='Client A After' class='w-full rounded-lg'>
      </div>
      <div class='bg-white shadow-lg rounded-lg p-6'>
        <h3 class='text-xl font-semibold mb-4'>Before</h3>
        <p class='text-gray-700'>Client B faced...</p>
        <img src='client-b-before.jpg' alt='Client B Before' class='w-full rounded-lg mb-4'>
        <h3 class='text-xl font-semibold mb-4'>After</h3>
        <p class='text-gray-700'>Post-engagement results...</p>
        <img src='client-b-after.jpg' alt='Client B After' class='w-full rounded-lg'>
      </div>
      <!-- Repeat for additional clients -->
    </div>
  </div>
</section>
```

## `roi` / `cards`

### Example 1: ROI Cards with Stats

**When To Use**: Use this layout to showcase key performance metrics that highlight the value of your product or service.

**Why It Works**: The card design creates a digestible format for presenting statistics, making it easy for users to scan and understand the benefits. The use of whitespace and contrast emphasizes important information.

**Tailwind Notes**:
- Utilizes a responsive grid layout for optimal display on all devices.
- Cards are elevated with shadow for a polished look.
- Consistent padding and margin create a clean and intentional layout.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Impact</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold text-blue-600'>Increase in Revenue</h3><p class='text-4xl font-bold text-gray-800'>40%</p></div><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold text-blue-600'>Customer Satisfaction</h3><p class='text-4xl font-bold text-gray-800'>95%</p></div><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold text-blue-600'>Time Saved</h3><p class='text-4xl font-bold text-gray-800'>30 Hours</p></div></div></div></section>
```

### Example 2: Feature Cards with Call to Action

**When To Use**: Ideal for highlighting features or benefits of a service with a clear call to action for engagement.

**Why It Works**: The combination of feature descriptions and prominent CTAs encourages user interaction. The layout is visually balanced, and the contrasting colors draw attention to the actions you want users to take.

**Tailwind Notes**:
- Cards are designed with hover effects to enhance interactivity.
- CTA buttons are styled for high visibility and accessibility.
- Spacing between cards ensures clarity and focus.

```html
<section class='py-12 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Unlock Your Potential</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-blue-50 border border-blue-200 rounded-lg p-6'><h3 class='text-xl font-semibold text-blue-800'>Feature 1</h3><p class='mt-2 text-gray-600'>Description of feature 1 that highlights its benefits.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-blue-50 border border-blue-200 rounded-lg p-6'><h3 class='text-xl font-semibold text-blue-800'>Feature 2</h3><p class='mt-2 text-gray-600'>Description of feature 2 that highlights its benefits.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-blue-50 border border-blue-200 rounded-lg p-6'><h3 class='text-xl font-semibold text-blue-800'>Feature 3</h3><p class='mt-2 text-gray-600'>Description of feature 3 that highlights its benefits.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div></div></section>
```

## `roi` / `calculator-teaser`

### Example 1: Simple ROI Calculator Teaser

**When To Use**: When you want to present a straightforward ROI calculator that highlights key benefits and encourages users to interact with the tool.

**Why It Works**: This layout uses a clear hierarchy with a bold heading and supportive text, making it easy for users to understand the value proposition. The CTA button is prominent, ensuring that it stands out and invites clicks.

**Tailwind Notes**:
- Utilizes flexbox for alignment and spacing.
- Responsive design ensures usability on mobile and desktop.
- Contrast between text and background enhances readability.

```html
<section class='bg-gray-100 p-8 rounded-lg shadow-lg text-center'>
  <h2 class='text-2xl font-bold text-gray-800 mb-4'>Calculate Your ROI</h2>
  <p class='text-gray-600 mb-6'>Discover how our solutions can boost your bottom line.</p>
  <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300'>Try the Calculator</a>
</section>
```

### Example 2: Detailed ROI Calculator Teaser with Stats

**When To Use**: When you want to provide more detailed statistics alongside the calculator teaser to build credibility and interest.

**Why It Works**: The use of cards for stats creates a visually appealing layout that breaks down information into digestible pieces. This encourages users to engage with the content and reinforces the value of the ROI calculator.

**Tailwind Notes**:
- Grid layout for responsive design that adapts to different screen sizes.
- Card components enhance visual separation and organization of information.
- Hover effects on cards improve interactivity and engagement.

```html
<section class='bg-white p-10 rounded-lg shadow-md'>
  <h2 class='text-3xl font-bold text-gray-900 text-center mb-8'>Unlock Your Potential ROI</h2>
  <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
    <div class='bg-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition duration-300'>
      <h3 class='text-xl font-semibold text-gray-800'>Increase Revenue</h3>
      <p class='text-gray-600'>Up to 30% increase in your annual revenue.</p>
    </div>
    <div class='bg-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition duration-300'>
      <h3 class='text-xl font-semibold text-gray-800'>Reduce Costs</h3>
      <p class='text-gray-600'>Save 20% on operational costs.</p>
    </div>
    <div class='bg-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition duration-300'>
      <h3 class='text-xl font-semibold text-gray-800'>Improve Efficiency</h3>
      <p class='text-gray-600'>Boost productivity by 25%.</p>
    </div>
  </div>
  <div class='text-center mt-8'>
    <a href='#' class='bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300'>Start Calculating</a>
  </div>
</section>
```

## `roi` / `stats-led`

### Example 1: Key Performance Indicators

**When To Use**: When showcasing important metrics that highlight the effectiveness of a product or service.

**Why It Works**: The use of a grid layout ensures that each statistic is given equal prominence, while the contrasting colors and typography draw attention to key figures. The clear CTA encourages user engagement.

**Tailwind Notes**:
- Grid layout for equal distribution of stats.
- Bold typography for emphasis on numbers.
- Responsive design adapts to various screen sizes.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-semibold text-center mb-8'>Our Impact</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white p-6 rounded-lg shadow-lg text-center'><h3 class='text-5xl font-bold text-blue-600'>150%</h3><p class='text-gray-600'>Increase in ROI</p></div><div class='bg-white p-6 rounded-lg shadow-lg text-center'><h3 class='text-5xl font-bold text-blue-600'>200+</h3><p class='text-gray-600'>Happy Clients</p></div><div class='bg-white p-6 rounded-lg shadow-lg text-center'><h3 class='text-5xl font-bold text-blue-600'>99%</h3><p class='text-gray-600'>Customer Satisfaction</p></div></div><a href='#' class='mt-8 inline-block bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition'>Get Started</a></div></section>
```

### Example 2: Performance Metrics Overview

**When To Use**: When a detailed overview of performance metrics is needed to build trust and credibility.

**Why It Works**: The use of alternating background colors for each stat card creates visual interest, while the consistent spacing and typography ensure readability. The CTA is prominently placed to encourage action.

**Tailwind Notes**:
- Alternating background colors for visual separation.
- Consistent padding and margins for a clean look.
- Strong CTA visibility with contrasting colors.

```html
<section class='py-16'><div class='container mx-auto'><h2 class='text-4xl font-bold text-center mb-10'>See Our Results</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'><div class='bg-white p-8 rounded-lg shadow-lg'><h3 class='text-6xl font-bold text-blue-500'>85%</h3><p class='text-gray-700'>Conversion Rate</p></div><div class='bg-gray-100 p-8 rounded-lg shadow-lg'><h3 class='text-6xl font-bold text-blue-500'>50%</h3><p class='text-gray-700'>Cost Reduction</p></div><div class='bg-white p-8 rounded-lg shadow-lg'><h3 class='text-6xl font-bold text-blue-500'>75%</h3><p class='text-gray-700'>Engagement Increase</p></div><div class='bg-gray-100 p-8 rounded-lg shadow-lg'><h3 class='text-6xl font-bold text-blue-500'>90%</h3><p class='text-gray-700'>Retention Rate</p></div></div><a href='#' class='mt-10 block text-center bg-blue-600 text-white py-4 px-8 rounded-lg shadow hover:bg-blue-700 transition'>Learn More</a></div></section>
```

## `pricing` / `side-by-side`

### Example 1: Basic vs. Premium Plans

**When To Use**: When you want to clearly differentiate between two pricing tiers, emphasizing the value of the higher tier.

**Why It Works**: The layout creates a clear visual hierarchy, making it easy for users to compare features. The use of contrasting colors for the CTA buttons enhances visibility and encourages action.

**Tailwind Notes**:
- Flexbox layout for side-by-side alignment.
- Use of shadow and rounded corners for card-like surfaces.
- Responsive design ensures accessibility on all devices.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Choose Your Plan</h2><div class='flex flex-col md:flex-row justify-center space-x-0 md:space-x-8'><div class='bg-white shadow-lg rounded-lg p-6 flex-1'><h3 class='text-xl font-semibold mb-4'>Basic Plan</h3><p class='text-gray-700 mb-4'>Perfect for individuals.</p><ul class='mb-4'><li class='mb-2'>✔ Feature 1</li><li class='mb-2'>✔ Feature 2</li><li class='mb-2'>✖ Feature 3</li></ul><div class='text-2xl font-bold mb-4'>$10/month</div><a href='#' class='block bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition'>Select</a></div><div class='bg-white shadow-lg rounded-lg p-6 flex-1'><h3 class='text-xl font-semibold mb-4'>Premium Plan</h3><p class='text-gray-700 mb-4'>Best for teams.</p><ul class='mb-4'><li class='mb-2'>✔ Feature 1</li><li class='mb-2'>✔ Feature 2</li><li class='mb-2'>✔ Feature 3</li></ul><div class='text-2xl font-bold mb-4'>$30/month</div><a href='#' class='block bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition'>Select</a></div></div></div></section>
```

### Example 2: Monthly vs. Yearly Plans

**When To Use**: Ideal for showcasing different billing cycles, encouraging users to opt for the yearly plan with a discount.

**Why It Works**: The clear distinction between plans with a highlighted yearly savings message increases perceived value, while the use of whitespace enhances readability.

**Tailwind Notes**:
- Incorporates a discount highlight for the yearly plan.
- Utilizes responsive grid for optimal display on various screen sizes.
- Consistent typography for a polished look.

```html
<section class='py-12 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Select Your Billing Cycle</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-8'><div class='bg-gray-100 shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Monthly Plan</h3><p class='text-gray-700 mb-4'>Pay as you go.</p><div class='text-2xl font-bold mb-4'>$15/month</div><a href='#' class='block bg-green-500 text-white text-center py-2 rounded-lg hover:bg-green-600 transition'>Choose Monthly</a></div><div class='bg-gray-200 shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Yearly Plan</h3><p class='text-gray-700 mb-4'>Save 20%!</p><div class='text-2xl font-bold mb-4'>$144/year <span class='text-sm text-green-600'>($12/month)</span></div><a href='#' class='block bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition'>Choose Yearly</a></div></div></div></section>
```

## `pricing` / `single-featured`

### Example 1: Simple Pricing Plan

**When To Use**: Use this layout for a straightforward pricing plan with a single feature highlighted, suitable for SaaS products or subscription services.

**Why It Works**: The clean layout with clear typography and ample white space draws attention to the pricing details and encourages user engagement. The call-to-action button is prominently displayed, enhancing conversion potential.

**Tailwind Notes**:
- Utilizes a flexbox layout for responsiveness.
- Employs rounded corners and shadows for a modern card design.
- Contrast between the pricing details and the background helps the plan stand out.

```html
<section class='py-12 bg-gray-100'><div class='max-w-4xl mx-auto text-center'><h2 class='text-3xl font-bold mb-6'>Choose Your Plan</h2><div class='flex justify-center space-x-8'><div class='bg-white shadow-lg rounded-lg p-8 w-80'><h3 class='text-xl font-semibold mb-4'>Basic Plan</h3><p class='text-gray-700 mb-4'>$19/month</p><p class='text-gray-600 mb-6'>Ideal for individuals and small teams.</p><button class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition'>Get Started</button></div></div></div></section>
```

### Example 2: Highlighted Feature Pricing

**When To Use**: Ideal for showcasing a single feature with a high-value pricing plan, especially when targeting users who are looking for premium options.

**Why It Works**: The use of a bold background color for the featured plan creates a sense of urgency and importance. The layout is designed to guide the user’s eye towards the CTA, while the surrounding plans are less visually dominant.

**Tailwind Notes**:
- Contrast between the featured plan and others enhances focus.
- Responsive grid layout adapts to screen sizes, maintaining usability.
- Effective use of typography to differentiate the plans.

```html
<section class='py-16'><div class='max-w-5xl mx-auto text-center'><h2 class='text-4xl font-bold mb-8'>Our Pricing Plans</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white shadow-md rounded-lg p-6'><h3 class='text-lg font-semibold mb-2'>Standard Plan</h3><p class='text-gray-700 mb-2'>$29/month</p><p class='text-gray-600 mb-4'>Great for small businesses.</p><button class='bg-gray-300 text-gray-700 py-2 px-4 rounded'>Choose Plan</button></div><div class='bg-blue-500 text-white shadow-lg rounded-lg p-6'><h3 class='text-lg font-semibold mb-2'>Premium Plan</h3><p class='text-2xl font-bold mb-2'>$49/month</p><p class='mb-4'>Best value for growing teams.</p><button class='bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200 transition'>Get Started</button></div><div class='bg-white shadow-md rounded-lg p-6'><h3 class='text-lg font-semibold mb-2'>Enterprise Plan</h3><p class='text-gray-700 mb-2'>Contact us for pricing</p><button class='bg-gray-300 text-gray-700 py-2 px-4 rounded'>Inquire Now</button></div></div></div></section>
```

## `pricing` / `table`

### Example 1: Simple Pricing Table

**When To Use**: Use this layout for clear, straightforward pricing options with a focus on a single plan.

**Why It Works**: The use of a highlighted plan draws attention to the preferred choice, while the clear layout and ample spacing make it easy to read and compare options.

**Tailwind Notes**:
- Uses flexbox for responsive layout.
- Contrast between plans enhances readability.
- Hover effect on buttons improves interactivity.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Choose Your Plan</h2><div class='flex flex-wrap justify-center'><div class='w-full sm:w-1/3 p-4'><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Basic</h3><p class='text-gray-600 mb-4'>$10/month</p><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li></ul><button class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Select</button></div></div><div class='w-full sm:w-1/3 p-4'><div class='bg-blue-100 shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Pro</h3><p class='text-gray-600 mb-4'>$20/month</p><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><button class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Select</button></div></div><div class='w-full sm:w-1/3 p-4'><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Enterprise</h3><p class='text-gray-600 mb-4'>$50/month</p><ul class='mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li><li class='mb-2'>Feature 4</li></ul><button class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Select</button></div></div></div></div></section>
```

### Example 2: Feature-Rich Pricing Table

**When To Use**: Ideal for showcasing multiple plans with detailed features, emphasizing the most popular option.

**Why It Works**: The use of different background colors for the plans helps to visually separate them while highlighting the most popular choice. The clear typography and ample spacing enhance readability.

**Tailwind Notes**:
- Responsive grid layout adapts to screen size.
- Text hierarchy is established with varying font sizes.
- Hover effects on buttons enhance user engagement.

```html
<section class='py-16 bg-gray-100'><div class='container mx-auto'><h2 class='text-4xl font-bold text-center mb-12'>Our Pricing Plans</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white shadow-md rounded-lg p-8 text-center'><h3 class='text-2xl font-semibold mb-4'>Starter</h3><p class='text-gray-500 mb-4'>$15/month</p><ul class='text-left mb-6'><li class='mb-2'>Feature A</li><li class='mb-2'>Feature B</li></ul><button class='bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700'>Select</button></div><div class='bg-blue-500 text-white shadow-md rounded-lg p-8 text-center'><h3 class='text-2xl font-semibold mb-4'>Most Popular</h3><p class='text-gray-200 mb-4'>$30/month</p><ul class='text-left mb-6'><li class='mb-2'>Feature A</li><li class='mb-2'>Feature B</li><li class='mb-2'>Feature C</li></ul><button class='bg-white text-blue-500 py-3 px-6 rounded-lg hover:bg-gray-200'>Select</button></div><div class='bg-white shadow-md rounded-lg p-8 text-center'><h3 class='text-2xl font-semibold mb-4'>Premium</h3><p class='text-gray-500 mb-4'>$50/month</p><ul class='text-left mb-6'><li class='mb-2'>Feature A</li><li class='mb-2'>Feature B</li><li class='mb-2'>Feature C</li><li class='mb-2'>Feature D</li></ul><button class='bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700'>Select</button></div></div></div></section>
```

## `pricing` / `tier-comparison`

### Example 1: Basic vs. Pro vs. Enterprise Comparison

**When To Use**: Use this layout when you want to clearly differentiate between multiple pricing tiers, highlighting the features and benefits of each plan.

**Why It Works**: This example uses a grid layout for clear visual separation, with emphasis on the most popular plan. The use of contrasting colors and typography helps guide the user's attention to key features and the call-to-action.

**Tailwind Notes**:
- Flexbox grid for responsive layout.
- Hover effects for interactivity.
- Emphasis on the primary plan with a distinct background color.

```html
<section class='py-12 bg-gray-50'>
  <div class='container mx-auto text-center'>
    <h2 class='text-3xl font-bold mb-8'>Choose Your Plan</h2>
    <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
      <div class='bg-white border rounded-lg shadow-md p-6'>
        <h3 class='text-xl font-semibold mb-4'>Basic</h3>
        <p class='text-gray-600 mb-4'>Ideal for individuals.</p>
        <ul class='mb-4'>
          <li class='mb-2'>✔ Feature 1</li>
          <li class='mb-2'>✔ Feature 2</li>
          <li class='mb-2'>✖ Feature 3</li>
        </ul>
        <span class='text-2xl font-bold'>$10/month</span>
        <a href='#' class='mt-4 block bg-blue-500 text-white text-center rounded-lg py-2 hover:bg-blue-600'>Get Started</a>
      </div>
      <div class='bg-blue-100 border rounded-lg shadow-md p-6 relative'>
        <span class='absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded'>Most Popular</span>
        <h3 class='text-xl font-semibold mb-4'>Pro</h3>
        <p class='text-gray-600 mb-4'>Perfect for small teams.</p>
        <ul class='mb-4'>
          <li class='mb-2'>✔ Feature 1</li>
          <li class='mb-2'>✔ Feature 2</li>
          <li class='mb-2'>✔ Feature 3</li>
        </ul>
        <span class='text-2xl font-bold'>$25/month</span>
        <a href='#' class='mt-4 block bg-blue-500 text-white text-center rounded-lg py-2 hover:bg-blue-600'>Get Started</a>
      </div>
      <div class='bg-white border rounded-lg shadow-md p-6'>
        <h3 class='text-xl font-semibold mb-4'>Enterprise</h3>
        <p class='text-gray-600 mb-4'>For large organizations.</p>
        <ul class='mb-4'>
          <li class='mb-2'>✔ Feature 1</li>
          <li class='mb-2'>✔ Feature 2</li>
          <li class='mb-2'>✔ Feature 3</li>
        </ul>
        <span class='text-2xl font-bold'>$50/month</span>
        <a href='#' class='mt-4 block bg-blue-500 text-white text-center rounded-lg py-2 hover:bg-blue-600'>Get Started</a>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Simple Feature Comparison Table

**When To Use**: This layout is ideal for showcasing a straightforward comparison of features across different pricing tiers in a table format.

**Why It Works**: The use of a table layout allows for easy scanning of features side-by-side, making it simple for users to compare what they get with each plan. The alternating background colors enhance readability, while clear CTAs encourage action.

**Tailwind Notes**:
- Table layout for clear feature comparison.
- Alternating row colors for readability.
- Strong CTA buttons for each plan.

```html
<section class='py-12 bg-white'>
  <div class='container mx-auto text-center'>
    <h2 class='text-3xl font-bold mb-8'>Pricing Plans</h2>
    <div class='overflow-x-auto'>
      <table class='min-w-full border-collapse border border-gray-200'>
        <thead>
          <tr class='bg-gray-100'>
            <th class='border border-gray-200 p-4'>Plan</th>
            <th class='border border-gray-200 p-4'>Basic</th>
            <th class='border border-gray-200 p-4'>Pro</th>
            <th class='border border-gray-200 p-4'>Enterprise</th>
          </tr>
        </thead>
        <tbody>
          <tr class='bg-white'>
            <td class='border border-gray-200 p-4'>Price</td>
            <td class='border border-gray-200 p-4'>$10/month</td>
            <td class='border border-gray-200 p-4'>$25/month</td>
            <td class='border border-gray-200 p-4'>$50/month</td>
          </tr>
          <tr class='bg-gray-50'>
            <td class='border border-gray-200 p-4'>Feature 1</td>
            <td class='border border-gray-200 p-4'>✔</td>
            <td class='border border-gray-200 p-4'>✔</td>
            <td class='border border-gray-200 p-4'>✔</td>
          </tr>
          <tr class='bg-white'>
            <td class='border border-gray-200 p-4'>Feature 2</td>
            <td class='border border-gray-200 p-4'>✔</td>
            <td class='border border-gray-200 p-4'>✔</td>
            <td class='border border-gray-200 p-4'>✔</td>
          </tr>
          <tr class='bg-gray-50'>
            <td class='border border-gray-200 p-4'>Feature 3</td>
            <td class='border border-gray-200 p-4'>✖</td>
            <td class='border border-gray-200 p-4'>✔</td>
            <td class='border border-gray-200 p-4'>✔</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class='mt-8'>
      <a href='#' class='inline-block bg-blue-500 text-white text-lg rounded-lg px-6 py-3 hover:bg-blue-600'>Choose Your Plan</a>
    </div>
  </div>
</section>
```

## `pricing` / `stacked-cards`

### Example 1: Basic Pricing Plans

**When To Use**: Use this layout when you want to present simple, clear pricing options for a service or product.

**Why It Works**: The use of a clean grid layout with distinct card styles creates a clear visual hierarchy, making it easy for users to compare options. The emphasis on the call-to-action button encourages conversions.

**Tailwind Notes**:
- Flexbox layout for responsiveness.
- Consistent padding and margin for spacing.
- Hover effects on cards to enhance interactivity.
- Clear typography for readability.

```html
<section class='bg-gray-50 py-16'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Choose Your Plan</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Basic</h3><p class='text-gray-600 mb-4'>$19/month</p><ul class='text-left mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition'>Choose Plan</a></div><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Standard</h3><p class='text-gray-600 mb-4'>$39/month</p><ul class='text-left mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition'>Choose Plan</a></div><div class='bg-white shadow-lg rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Premium</h3><p class='text-gray-600 mb-4'>$59/month</p><ul class='text-left mb-6'><li class='mb-2'>Feature 1</li><li class='mb-2'>Feature 2</li><li class='mb-2'>Feature 3</li></ul><a href='#' class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition'>Choose Plan</a></div></div></div></section>
```

### Example 2: Feature-Rich Pricing Cards

**When To Use**: Ideal for showcasing multiple tiers with a focus on features to help users make informed decisions.

**Why It Works**: By highlighting features and using contrasting colors for the premium option, users can easily see the value of each plan. The layout is responsive, ensuring a good experience on all devices.

**Tailwind Notes**:
- Use of background colors to differentiate plans.
- Responsive grid for mobile and desktop views.
- Hover effects to indicate interactivity.
- Clear CTAs with color contrast.

```html
<section class='bg-white py-16'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Pricing Plans</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-gray-100 border border-gray-300 rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Starter</h3><p class='text-gray-700 mb-4'>$29/month</p><ul class='text-left mb-6'><li class='mb-2'>Basic Support</li><li class='mb-2'>Limited Features</li><li class='mb-2'>Community Access</li></ul><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Select Plan</a></div><div class='bg-white border border-gray-300 rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Professional</h3><p class='text-gray-700 mb-4'>$49/month</p><ul class='text-left mb-6'><li class='mb-2'>Priority Support</li><li class='mb-2'>All Features</li><li class='mb-2'>Forum Access</li></ul><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Select Plan</a></div><div class='bg-blue-500 text-white border border-blue-600 rounded-lg p-6 text-center'><h3 class='text-xl font-semibold mb-4'>Enterprise</h3><p class='text-white mb-4'>$99/month</p><ul class='text-left mb-6'><li class='mb-2'>24/7 Support</li><li class='mb-2'>All Features</li><li class='mb-2'>Dedicated Account Manager</li></ul><a href='#' class='bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-100 transition'>Select Plan</a></div></div></div></section>
```

## `pricing` / `contrast-featured`

### Example 1: Tiered Pricing Plans

**When To Use**: When you want to showcase multiple pricing tiers with clear distinctions and an emphasis on the most popular plan.

**Why It Works**: This layout uses contrasting colors and spacing to draw attention to the featured plan, making it visually appealing and easy to understand for potential customers.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs background colors and shadows for depth.
- Clear typography hierarchy enhances readability.

```html
<section class='py-16 bg-gray-100'><div class='container mx-auto text-center'><h2 class='text-3xl font-bold mb-8'>Choose Your Plan</h2><div class='flex flex-wrap justify-center gap-8'><div class='max-w-xs rounded-lg shadow-lg bg-white p-6'><h3 class='text-xl font-semibold mb-4'>Basic</h3><p class='text-gray-600 mb-4'>$10/month</p><ul class='text-left mb-6'><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul><a href='#' class='block bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600'>Select</a></div><div class='max-w-xs rounded-lg shadow-lg bg-blue-500 text-white p-6 transform hover:scale-105 transition-transform duration-300'><h3 class='text-xl font-semibold mb-4'>Popular</h3><p class='text-2xl font-bold mb-4'>$20/month</p><ul class='text-left mb-6'><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul><a href='#' class='block bg-white text-blue-500 text-center py-2 rounded-lg hover:bg-gray-200'>Select</a></div><div class='max-w-xs rounded-lg shadow-lg bg-white p-6'><h3 class='text-xl font-semibold mb-4'>Pro</h3><p class='text-gray-600 mb-4'>$30/month</p><ul class='text-left mb-6'><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul><a href='#' class='block bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600'>Select</a></div></div></div></section>
```

### Example 2: Single Featured Plan with Comparison

**When To Use**: When you want to highlight a single plan while still providing a comparison of features against competitors.

**Why It Works**: The use of a contrasting background and larger typography for the featured plan makes it stand out, while the comparison table below provides clarity on what sets it apart.

**Tailwind Notes**:
- Contrast in colors helps the featured plan pop.
- Flexbox layout for responsive design.
- Clear call-to-action buttons improve conversion rates.

```html
<section class='py-16 bg-gray-800'><div class='container mx-auto text-center text-white'><h2 class='text-4xl font-bold mb-8'>Our Best Plan</h2><div class='max-w-md mx-auto bg-gray-700 rounded-lg shadow-lg p-8'><h3 class='text-2xl font-semibold mb-4'>Ultimate Plan</h3><p class='text-3xl font-bold mb-4'>$49/month</p><ul class='text-left mb-6'><li class='mb-2'>Unlimited Features</li><li class='mb-2'>24/7 Support</li><li class='mb-2'>Free Updates</li></ul><a href='#' class='block bg-blue-500 text-center py-3 rounded-lg hover:bg-blue-600'>Get Started</a></div><h3 class='text-2xl font-semibold mt-12 mb-4'>Compare with Others</h3><div class='overflow-x-auto'><table class='min-w-full text-left'><thead class='bg-gray-600'><tr><th class='py-2'>Features</th><th class='py-2'>Competitor A</th><th class='py-2'>Competitor B</th></tr></thead><tbody class='bg-gray-700'><tr><td>Unlimited Features</td><td>No</td><td>Yes</td></tr><tr><td>24/7 Support</td><td>Yes</td><td>No</td></tr><tr><td>Free Updates</td><td>No</td><td>No</td></tr></tbody></table></div></div></section>
```

## `custom-quote` / `cta-box`

### Example 1: Promotional Quote with Call to Action

**When To Use**: Use this section to highlight a key quote from a customer or influencer that aligns with your brand message, paired with a strong call to action.

**Why It Works**: The combination of a bold quote, clear hierarchy, and prominent CTA buttons creates an engaging focal point that encourages user interaction.

**Tailwind Notes**:
- Utilizes a contrasting background color to draw attention.
- Generous padding and margin for breathing space.
- Responsive typography for readability across devices.

```html
<section class='bg-blue-500 text-white py-12 px-6 text-center rounded-lg shadow-lg'>
  <h2 class='text-3xl font-bold mb-4'>"Your success is our mission!"</h2>
  <p class='text-lg mb-6'>Join thousands of satisfied customers who have transformed their lives.</p>
  <div class='flex justify-center space-x-4'>
    <a href='#' class='bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-200 transition'>Get Started</a>
    <a href='#' class='bg-transparent border border-white text-white font-semibold py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition'>Learn More</a>
  </div>
</section>
```

### Example 2: Testimonial Highlight with Action Buttons

**When To Use**: Ideal for showcasing customer testimonials that drive trust and encourage potential customers to take action.

**Why It Works**: The layout emphasizes the quote and testimonials, while the buttons are designed to stand out, making it easy for users to engage.

**Tailwind Notes**:
- Uses a soft background color for a calming effect.
- Text alignment and spacing create a clean, organized look.
- Hover effects on buttons enhance interactivity.

```html
<section class='bg-gray-100 text-gray-800 py-10 px-5 rounded-lg shadow-md'>
  <h2 class='text-2xl font-semibold text-center mb-4'>What Our Customers Say</h2>
  <blockquote class='text-lg italic mb-6'>
    <p>"This service has changed my life for the better!"</p>
    <cite class='block text-right font-bold'>- Jane Doe</cite>
  </blockquote>
  <div class='flex justify-center space-x-4'>
    <a href='#' class='bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700 transition'>Start Your Journey</a>
    <a href='#' class='bg-transparent border border-blue-600 text-blue-600 py-2 px-6 rounded-md hover:bg-blue-600 hover:text-white transition'>See Plans</a>
  </div>
</section>
```

### Example 3: Inspirational Quote with Dual CTA

**When To Use**: Use this section to inspire and motivate users while providing clear paths to engage with your services.

**Why It Works**: The inspirational quote paired with dual calls to action creates a sense of urgency and encourages users to explore further.

**Tailwind Notes**:
- Bold typography for the quote ensures it captures attention.
- Dual buttons allow for choice, catering to different user intents.
- Responsive design ensures accessibility on all devices.

```html
<section class='bg-white text-gray-900 py-16 px-8 text-center rounded-lg shadow-lg'>
  <h2 class='text-4xl font-extrabold mb-4'>"Empower Your Future Today!"</h2>
  <p class='text-md mb-8'>Discover how we can help you achieve your goals.</p>
  <div class='flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4'>
    <a href='#' class='bg-green-500 text-white py-3 px-5 rounded-lg shadow hover:bg-green-600 transition'>Join Us Now</a>
    <a href='#' class='bg-transparent border border-green-500 text-green-500 py-3 px-5 rounded-lg hover:bg-green-500 hover:text-white transition'>Get a Free Trial</a>
  </div>
</section>
```

## `custom-quote` / `form-inline`

### Example 1: Inline Quote with Call to Action

**When To Use**: When you want to present a powerful quote alongside a clear call to action, ideal for landing pages or promotional sections.

**Why It Works**: The layout emphasizes the quote while ensuring the CTA stands out, encouraging user interaction. The use of contrasting colors and ample spacing creates a visually appealing design.

**Tailwind Notes**:
- Uses flexbox for alignment and spacing.
- Contrast between text and background enhances readability.
- Responsive design ensures usability on all devices.

```html
<section class='bg-gray-100 p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between'>
  <div class='mb-4 md:mb-0 md:w-2/3'>
    <h2 class='text-2xl font-bold text-gray-800'>"The only limit to our realization of tomorrow is our doubts of today."</h2>
    <p class='text-gray-600 mt-2'>- Franklin D. Roosevelt</p>
  </div>
  <div class='flex-shrink-0'>
    <a href='#' class='bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-200'>Get Started</a>
  </div>
</section>
```

### Example 2: Quote with Subheading and Dual CTA

**When To Use**: When you want to provide additional context to the quote and offer multiple actions for the user, suitable for promotional or informational sections.

**Why It Works**: The layout effectively balances the quote, subheading, and CTAs, using spacing to guide the user's eye. The contrasting buttons encourage engagement, while the typography hierarchy enhances readability.

**Tailwind Notes**:
- Utilizes grid layout for better alignment and spacing.
- Subheading adds context without overwhelming the main quote.
- Hover effects on buttons improve user interaction.

```html
<section class='bg-white p-10 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6'>
  <div>
    <h2 class='text-3xl font-semibold text-gray-900'>"Success is not final, failure is not fatal: It is the courage to continue that counts."</h2>
    <h3 class='text-lg text-gray-500 mt-2'>- Winston S. Churchill</h3>
  </div>
  <div class='flex flex-col justify-center'>
    <p class='text-gray-700 mb-4'>Join us in making a difference today!</p>
    <div class='flex space-x-4'>
      <a href='#' class='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200'>Learn More</a>
      <a href='#' class='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200'>Sign Up</a>
    </div>
  </div>
</section>
```

## `custom-quote` / `advisor-style`

### Example 1: Single Advisor Quote with Call to Action

**When To Use**: Use this layout when you want to highlight a key quote from an advisor along with a strong call to action.

**Why It Works**: The strong contrast between the background and text draws attention to the quote, while the CTA button is prominent and inviting.

**Tailwind Notes**:
- Use of max-w-2xl for limiting width and improving readability.
- Flexbox for centering content and ensuring responsiveness.
- Text-gray-700 for a softer contrast against the background.

```html
<section class='bg-white py-12'><div class='max-w-2xl mx-auto text-center'><h2 class='text-3xl font-bold text-gray-900 mb-4'>Insightful Advice from Our Experts</h2><p class='text-lg text-gray-700 mb-6'>"Investing in knowledge pays the best interest."</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition duration-200'>Get Started</a></div></section>
```

### Example 2: Multiple Advisor Quotes in a Grid Layout

**When To Use**: Ideal for showcasing multiple quotes from various advisors to build credibility and trust.

**Why It Works**: The grid layout allows for easy comparison of quotes, while consistent spacing and card styling maintain a clean and organized appearance.

**Tailwind Notes**:
- Grid layout for responsive design with gap-6 for spacing.
- Shadow and rounded corners for a card-like effect.
- Hover effects on cards to enhance interactivity.

```html
<section class='bg-gray-100 py-12'><div class='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200'><p class='text-lg text-gray-800 italic mb-4'>"The best time to plant a tree was 20 years ago. The second best time is now."</p><p class='text-sm text-gray-600'>- Advisor A</p></div><div class='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200'><p class='text-lg text-gray-800 italic mb-4'>"Success usually comes to those who are too busy to be looking for it."</p><p class='text-sm text-gray-600'>- Advisor B</p></div><div class='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200'><p class='text-lg text-gray-800 italic mb-4'>"Don't watch the clock; do what it does. Keep going."</p><p class='text-sm text-gray-600'>- Advisor C</p></div></div></section>
```

### Example 3: Highlighted Advisor Quote with Subheading

**When To Use**: Use when you want to emphasize a particular quote while providing context through a subheading.

**Why It Works**: The use of a subheading helps set the stage for the quote, while the layout maintains a clean and engaging flow.

**Tailwind Notes**:
- Use of text-center for alignment and emphasis.
- Padding and margin utilities for balanced spacing.
- Background color contrast to make the section stand out.

```html
<section class='bg-blue-50 py-12'><div class='max-w-2xl mx-auto text-center'><h2 class='text-2xl font-semibold text-blue-800 mb-2'>Words of Wisdom</h2><h3 class='text-lg text-gray-600 mb-4'>Expert Advice to Guide Your Journey</h3><blockquote class='text-xl text-gray-900 italic mb-6'>"The only limit to our realization of tomorrow will be our doubts of today."</blockquote><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition duration-200'>Learn More</a></div></section>
```

## `billing-toggle` / `monthly-yearly`

### Example 1: Monthly vs Yearly Billing Toggle

**When To Use**: Use this section to encourage users to choose between monthly and yearly billing options, highlighting the savings of yearly plans.

**Why It Works**: The clear visual distinction between the two billing options, combined with strong CTAs and ample spacing, creates an effective decision-making environment for users.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs contrasting colors for emphasis on CTAs.
- Incorporates rounded corners and shadows for a polished look.

```html
<section class='py-12 bg-gray-100'>
  <div class='max-w-7xl mx-auto text-center'>
    <h2 class='text-3xl font-bold text-gray-800 mb-6'>Choose Your Plan</h2>
    <div class='flex justify-center space-x-4 mb-8'>
      <button class='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'>Monthly</button>
      <button class='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700'>Yearly
        <span class='ml-1 text-xs text-blue-200'>(Save 20%)</span>
      </button>
    </div>
    <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div class='p-6 bg-white rounded-lg shadow-md'>
        <h3 class='text-xl font-semibold text-gray-800'>Basic Plan</h3>
        <p class='mt-2 text-gray-600'>$10/month</p>
        <p class='mt-4 text-gray-600'>Perfect for individuals.</p>
        <button class='mt-6 w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'>Select</button>
      </div>
      <div class='p-6 bg-white rounded-lg shadow-md'>
        <h3 class='text-xl font-semibold text-gray-800'>Pro Plan</h3>
        <p class='mt-2 text-gray-600'>$20/month</p>
        <p class='mt-4 text-gray-600'>Ideal for small teams.</p>
        <button class='mt-6 w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'>Select</button>
      </div>
      <div class='p-6 bg-white rounded-lg shadow-md'>
        <h3 class='text-xl font-semibold text-gray-800'>Enterprise Plan</h3>
        <p class='mt-2 text-gray-600'>$50/month</p>
        <p class='mt-4 text-gray-600'>For larger organizations.</p>
        <button class='mt-6 w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'>Select</button>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Annual Savings Highlight

**When To Use**: Ideal for promoting annual billing with a focus on cost savings, especially when targeting budget-conscious users.

**Why It Works**: The use of contrasting colors and typography for the savings message draws attention, while the grid layout ensures a clean and organized presentation.

**Tailwind Notes**:
- Highlight savings with a different text color.
- Responsive grid layout adapts to various screen sizes.
- Consistent button styles enhance usability.

```html
<section class='py-12 bg-white'>
  <div class='max-w-7xl mx-auto text-center'>
    <h2 class='text-3xl font-bold text-gray-800 mb-6'>Billing Plans</h2>
    <p class='mb-8 text-lg text-gray-600'>Switch to annual billing and save 20%!</p>
    <div class='flex justify-center space-x-4 mb-6'>
      <button class='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'>Monthly</button>
      <button class='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700'>Yearly</button>
    </div>
    <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div class='p-6 bg-gray-100 rounded-lg shadow-md'>
        <h3 class='text-xl font-semibold text-gray-800'>Starter Plan</h3>
        <p class='mt-2 text-gray-600'>Monthly: $15</p>
        <p class='mt-2 text-gray-600'>Yearly: $144 <span class='text-green-600 font-semibold'>(Save $36)</span></p>
        <button class='mt-6 w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'>Select</button>
      </div>
      <div class='p-6 bg-gray-100 rounded-lg shadow-md'>
        <h3 class='text-xl font-semibold text-gray-800'>Professional Plan</h3>
        <p class='mt-2 text-gray-600'>Monthly: $30</p>
        <p class='mt-2 text-gray-600'>Yearly: $288 <span class='text-green-600 font-semibold'>(Save $72)</span></p>
        <button class='mt-6 w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'>Select</button>
      </div>
      <div class='p-6 bg-gray-100 rounded-lg shadow-md'>
        <h3 class='text-xl font-semibold text-gray-800'>Business Plan</h3>
        <p class='mt-2 text-gray-600'>Monthly: $60</p>
        <p class='mt-2 text-gray-600'>Yearly: $576 <span class='text-green-600 font-semibold'>(Save $144)</span></p>
        <button class='mt-6 w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'>Select</button>
      </div>
    </div>
  </div>
</section>
```

## `billing-toggle` / `usage-based`

### Example 1: Usage-Based Billing Plans

**When To Use**: When showcasing different usage-based billing plans to potential customers.

**Why It Works**: This layout effectively highlights the key features of each plan while maintaining a clear visual hierarchy. The use of cards allows for easy comparison, and the CTA is prominently displayed for conversion.

**Tailwind Notes**:
- Flexbox layout for responsive card arrangement.
- Consistent spacing for a clean look.
- High contrast for CTAs to draw attention.

```html
<section class="py-12 bg-gray-50">
  <div class="container mx-auto text-center">
    <h2 class="text-3xl font-bold mb-6">Choose Your Plan</h2>
    <p class="text-lg text-gray-600 mb-12">Only pay for what you use. Flexible plans that grow with your needs.</p>
    <div class="flex flex-wrap justify-center gap-6">
      <div class="bg-white shadow-lg rounded-lg p-6 w-80">
        <h3 class="text-xl font-semibold mb-4">Basic Plan</h3>
        <p class="text-gray-700 mb-4">Perfect for small projects.</p>
        <span class="block text-2xl font-bold mb-4">$10/month</span>
        <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Select</button>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 w-80">
        <h3 class="text-xl font-semibold mb-4">Pro Plan</h3>
        <p class="text-gray-700 mb-4">Ideal for growing teams.</p>
        <span class="block text-2xl font-bold mb-4">$30/month</span>
        <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Select</button>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 w-80">
        <h3 class="text-xl font-semibold mb-4">Enterprise Plan</h3>
        <p class="text-gray-700 mb-4">For large organizations.</p>
        <span class="block text-2xl font-bold mb-4">$100/month</span>
        <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Select</button>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Flexible Usage Plans with Toggle

**When To Use**: When you want to provide users with a toggle feature to switch between monthly and annual billing options.

**Why It Works**: The toggle feature allows users to see the cost implications of their choices instantly. The layout is designed to be visually engaging, with clear distinctions between the plans and a strong emphasis on the CTA.

**Tailwind Notes**:
- Toggle switch for seamless user experience.
- Responsive design for mobile and desktop views.
- Clear differentiation of pricing options.

```html
<section class="py-12 bg-white">
  <div class="container mx-auto text-center">
    <h2 class="text-3xl font-bold mb-6">Billing Made Simple</h2>
    <p class="text-lg text-gray-600 mb-8">Switch between monthly and annual billing to find what suits you best.</p>
    <div class="mb-8">
      <label class="inline-flex items-center cursor-pointer">
        <span class="mr-2 text-gray-600">Monthly</span>
        <input type="checkbox" class="toggle-checkbox hidden" />
        <span class="toggle-label bg-gray-300 rounded-full w-14 h-8 flex items-center p-1 transition duration-300 ease-in-out">
          <span class="toggle-inner bg-blue-500 rounded-full w-6 h-6 shadow-md transform transition duration-300 ease-in-out"></span>
        </span>
        <span class="ml-2 text-gray-600">Annual</span>
      </label>
    </div>
    <div class="flex flex-wrap justify-center gap-6">
      <div class="bg-gray-100 shadow-lg rounded-lg p-6 w-80">
        <h3 class="text-xl font-semibold mb-4">Basic Plan</h3>
        <p class="text-gray-700 mb-4">Perfect for individuals.</p>
        <span class="block text-2xl font-bold mb-4">$10/month</span>
        <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Select</button>
      </div>
      <div class="bg-gray-100 shadow-lg rounded-lg p-6 w-80">
        <h3 class="text-xl font-semibold mb-4">Pro Plan</h3>
        <p class="text-gray-700 mb-4">For small teams.</p>
        <span class="block text-2xl font-bold mb-4">$25/month</span>
        <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Select</button>
      </div>
      <div class="bg-gray-100 shadow-lg rounded-lg p-6 w-80">
        <h3 class="text-xl font-semibold mb-4">Enterprise Plan</h3>
        <p class="text-gray-700 mb-4">For large organizations.</p>
        <span class="block text-2xl font-bold mb-4">$75/month</span>
        <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Select</button>
      </div>
    </div>
  </div>
</section>
```

## `faq` / `accordion`

### Example 1: Simple FAQ Accordion

**When To Use**: Use this for straightforward FAQ sections where users can expand to read answers without overwhelming them with information at first glance.

**Why It Works**: The use of rounded corners and shadow creates a sense of depth, making the accordion feel tactile. The clear typography hierarchy emphasizes questions and answers, while the hover and focus effects enhance accessibility.

**Tailwind Notes**:
- Rounded corners and shadows add depth and interactivity.
- Hover effects improve usability and engagement.
- Responsive design ensures readability across devices.

```html
<section class='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
  <h2 class='text-2xl font-bold mb-4'>Frequently Asked Questions</h2>
  <div class='space-y-2'>
    <div class='border-b border-gray-200'>
      <button class='flex justify-between items-center w-full py-4 text-left text-gray-700 hover:bg-gray-100 focus:outline-none' onclick='this.nextElementSibling.classList.toggle("hidden")'>
        <span class='font-semibold'>What is your return policy?</span>
        <svg class='w-5 h-5 transition-transform transform rotate-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5l7 7-7 7' />
        </svg>
      </button>
      <div class='hidden pl-4 py-2 text-gray-600'>
        We offer a 30-day return policy on all items.
      </div>
    </div>
    <div class='border-b border-gray-200'>
      <button class='flex justify-between items-center w-full py-4 text-left text-gray-700 hover:bg-gray-100 focus:outline-none' onclick='this.nextElementSibling.classList.toggle("hidden")'>
        <span class='font-semibold'>How do I track my order?</span>
        <svg class='w-5 h-5 transition-transform transform rotate-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5l7 7-7 7' />
        </svg>
      </button>
      <div class='hidden pl-4 py-2 text-gray-600'>
        You can track your order using the tracking link sent to your email.
      </div>
    </div>
  </div>
</section>
```

### Example 2: Stylish FAQ Accordion with Icons

**When To Use**: Ideal for branding-focused sites where visual elements enhance the user experience, making the FAQ section more engaging.

**Why It Works**: Incorporating icons next to questions adds a visual cue that aligns with the brand's identity. The use of color and spacing creates a polished look, while the clear call-to-action encourages user interaction.

**Tailwind Notes**:
- Icons enhance visual engagement and brand identity.
- Color accents draw attention to important elements.
- Consistent spacing improves readability and aesthetics.

```html
<section class='max-w-3xl mx-auto p-8 bg-gray-50 rounded-lg shadow-md'>
  <h2 class='text-3xl font-bold text-center mb-6'>Your Questions Answered</h2>
  <div class='space-y-4'>
    <div class='border-b border-gray-300'>
      <button class='flex items-center justify-between w-full py-5 text-left text-gray-800 hover:bg-gray-200 focus:outline-none' onclick='this.nextElementSibling.classList.toggle("hidden")'>
        <span class='flex items-center'>
          <svg class='w-6 h-6 mr-2 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V5h2v6z'/></svg>
          <span class='font-semibold'>How can I contact support?</span>
        </span>
        <svg class='w-5 h-5 transition-transform transform rotate-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5l7 7-7 7' />
        </svg>
      </button>
      <div class='hidden pl-4 py-3 text-gray-700'>
        You can reach our support team via the contact form on our website.
      </div>
    </div>
    <div class='border-b border-gray-300'>
      <button class='flex items-center justify-between w-full py-5 text-left text-gray-800 hover:bg-gray-200 focus:outline-none' onclick='this.nextElementSibling.classList.toggle("hidden")'>
        <span class='flex items-center'>
          <svg class='w-6 h-6 mr-2 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V5h2v6z'/></svg>
          <span class='font-semibold'>What payment methods do you accept?</span>
        </span>
        <svg class='w-5 h-5 transition-transform transform rotate-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5l7 7-7 7' />
        </svg>
      </button>
      <div class='hidden pl-4 py-3 text-gray-700'>
        We accept all major credit cards and PayPal.
      </div>
    </div>
  </div>
</section>
```

## `faq` / `two-column`

### Example 1: FAQ Section with Icons

**When To Use**: When you want to provide a visually engaging FAQ section that highlights key questions with icons for better recognition.

**Why It Works**: The use of icons alongside questions adds a visual cue that enhances user experience. The two-column layout allows for efficient use of space while maintaining readability.

**Tailwind Notes**:
- Flexbox for responsive two-column layout.
- Consistent spacing and padding improve readability.
- Hover effects on questions to enhance interactivity.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Frequently Asked Questions</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-8'><div class='flex items-start space-x-4'><div class='flex-shrink-0'><svg class='w-8 h-8 text-blue-600' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/></svg></div><div><h3 class='text-xl font-semibold'>What is your return policy?</h3><p class='text-gray-600'>You can return any item within 30 days of purchase for a full refund.</p></div></div><div class='flex items-start space-x-4'><div class='flex-shrink-0'><svg class='w-8 h-8 text-blue-600' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/></svg></div><div><h3 class='text-xl font-semibold'>How long does shipping take?</h3><p class='text-gray-600'>Shipping typically takes 5-7 business days depending on your location.</p></div></div></div></div></section>
```

### Example 2: FAQ Section with Accordion Style

**When To Use**: When you want to present a compact FAQ section that allows users to expand and collapse answers for a cleaner look.

**Why It Works**: The accordion style saves space and allows users to focus on questions of interest. The use of contrasting colors for expanded items enhances visibility.

**Tailwind Notes**:
- Transition effects for smooth opening and closing of FAQ items.
- Hover effects to indicate interactivity.
- Use of background colors to differentiate active states.

```html
<section class='py-12 bg-white'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Frequently Asked Questions</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-6'><div class='border border-gray-200 rounded-lg'><button class='w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none'><h3 class='text-lg font-medium'>What payment methods do you accept?</h3></button><div class='p-4 hidden'><p class='text-gray-600'>We accept all major credit cards, PayPal, and bank transfers.</p></div></div><div class='border border-gray-200 rounded-lg'><button class='w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none'><h3 class='text-lg font-medium'>Can I change my order?</h3></button><div class='p-4 hidden'><p class='text-gray-600'>Yes, you can change your order within 24 hours of purchase.</p></div></div></div></div></section>
```

## `faq` / `vertical`

### Example 1: Simple FAQ Section

**When To Use**: Use this layout for straightforward FAQs that require clear visibility and easy access to answers.

**Why It Works**: The use of contrasting backgrounds and ample spacing enhances readability, while the clear hierarchy makes it easy for users to scan through questions.

**Tailwind Notes**:
- Utilizes a light background for contrast against text.
- Employs consistent padding and margin for a polished layout.
- Hover effects on questions improve interactivity.

```html
<section class='bg-gray-50 p-8 rounded-lg shadow-md'>
  <h2 class='text-2xl font-semibold mb-6'>Frequently Asked Questions</h2>
  <div class='space-y-4'>
    <div class='bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow'>
      <h3 class='text-lg font-medium cursor-pointer'>What is your return policy?</h3>
      <p class='mt-2 text-gray-600'>You can return any item within 30 days of purchase.</p>
    </div>
    <div class='bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow'>
      <h3 class='text-lg font-medium cursor-pointer'>Do you ship internationally?</h3>
      <p class='mt-2 text-gray-600'>Yes, we ship to over 100 countries worldwide.</p>
    </div>
    <div class='bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow'>
      <h3 class='text-lg font-medium cursor-pointer'>How can I track my order?</h3>
      <p class='mt-2 text-gray-600'>You will receive a tracking link via email once your order has shipped.</p>
    </div>
  </div>
</section>
```

### Example 2: Interactive FAQ with Toggle

**When To Use**: Ideal for FAQs that require more detailed answers and user interaction, allowing users to expand/collapse answers.

**Why It Works**: The toggle feature keeps the section clean and organized, while the card-like design draws attention to each question. The use of icons enhances visual interest.

**Tailwind Notes**:
- Incorporates icons for a modern touch.
- Utilizes transitions for smooth interaction.
- Emphasizes questions with bold typography.

```html
<section class='bg-white p-10 rounded-lg shadow-lg'>
  <h2 class='text-3xl font-bold text-center mb-8'>Your Questions, Answered</h2>
  <div class='space-y-4'>
    <div class='border-b pb-4'>
      <button class='flex justify-between items-center w-full text-left text-lg font-semibold focus:outline-none'>
        <span>What payment methods do you accept?</span>
        <svg class='w-5 h-5 transform transition-transform duration-200'>&#x25BC;</svg>
      </button>
      <p class='mt-2 text-gray-600 hidden'>We accept all major credit cards, PayPal, and Apple Pay.</p>
    </div>
    <div class='border-b pb-4'>
      <button class='flex justify-between items-center w-full text-left text-lg font-semibold focus:outline-none'>
        <span>Can I change my order after placing it?</span>
        <svg class='w-5 h-5 transform transition-transform duration-200'>&#x25BC;</svg>
      </button>
      <p class='mt-2 text-gray-600 hidden'>Yes, you can change your order within 24 hours of placing it.</p>
    </div>
    <div class='border-b pb-4'>
      <button class='flex justify-between items-center w-full text-left text-lg font-semibold focus:outline-none'>
        <span>How do I contact customer support?</span>
        <svg class='w-5 h-5 transform transition-transform duration-200'>&#x25BC;</svg>
      </button>
      <p class='mt-2 text-gray-600 hidden'>You can reach us via email or live chat on our website.</p>
    </div>
  </div>
</section>
```

## `faq` / `side-panel`

### Example 1: FAQ with Side Navigation Panel

**When To Use**: Use this layout when you want to provide quick access to frequently asked questions while keeping the main content easily readable.

**Why It Works**: The side panel allows users to navigate through questions without losing context of the content, while the clear typography and spacing enhance readability and focus on the questions.

**Tailwind Notes**:
- Use `flex` for layout to create a side panel effect.
- Incorporate `bg-white` for the main content area and `bg-gray-100` for the sidebar for contrast.
- Use `hover:bg-gray-200` on question items for interactivity.

```html
<section class='flex flex-col md:flex-row p-8 bg-gray-50'>
  <aside class='w-full md:w-1/4 bg-gray-100 p-4 rounded-lg shadow-md'>
    <h2 class='text-lg font-semibold mb-4'>Quick Links</h2>
    <ul>
      <li class='mb-2'><a href='#q1' class='block p-2 hover:bg-gray-200 rounded'>What is your return policy?</a></li>
      <li class='mb-2'><a href='#q2' class='block p-2 hover:bg-gray-200 rounded'>How do I track my order?</a></li>
      <li class='mb-2'><a href='#q3' class='block p-2 hover:bg-gray-200 rounded'>Can I change my order?</a></li>
    </ul>
  </aside>
  <div class='w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md'>
    <h2 class='text-2xl font-bold mb-6'>Frequently Asked Questions</h2>
    <div id='q1' class='mb-4'>
      <h3 class='text-xl font-semibold'>What is your return policy?</h3>
      <p class='text-gray-700'>You can return any item within 30 days of purchase for a full refund.</p>
    </div>
    <div id='q2' class='mb-4'>
      <h3 class='text-xl font-semibold'>How do I track my order?</h3>
      <p class='text-gray-700'>You will receive a tracking number via email once your order ships.</p>
    </div>
    <div id='q3' class='mb-4'>
      <h3 class='text-xl font-semibold'>Can I change my order?</h3>
      <p class='text-gray-700'>Yes, you can change your order within 24 hours of purchase.</p>
    </div>
  </div>
</section>
```

### Example 2: Collapsible FAQ with Side Panel

**When To Use**: Ideal for a more interactive experience where users can expand and collapse questions to save space and focus on what matters.

**Why It Works**: The collapsible feature allows users to control their view, while the side panel provides quick navigation. The use of shadows and rounded corners enhances the visual hierarchy.

**Tailwind Notes**:
- Use `transition` classes for smooth opening and closing of questions.
- Apply `rounded-lg` to create a softer look.
- Include `cursor-pointer` for clickable elements.

```html
<section class='flex flex-col md:flex-row p-8 bg-gray-50'>
  <aside class='w-full md:w-1/4 bg-gray-100 p-4 rounded-lg shadow-md'>
    <h2 class='text-lg font-semibold mb-4'>Quick Links</h2>
    <ul>
      <li class='mb-2'><a href='#q1' class='block p-2 hover:bg-gray-200 rounded'>What is your return policy?</a></li>
      <li class='mb-2'><a href='#q2' class='block p-2 hover:bg-gray-200 rounded'>How do I track my order?</a></li>
      <li class='mb-2'><a href='#q3' class='block p-2 hover:bg-gray-200 rounded'>Can I change my order?</a></li>
    </ul>
  </aside>
  <div class='w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md'>
    <h2 class='text-2xl font-bold mb-6'>Frequently Asked Questions</h2>
    <div class='mb-4'>
      <h3 class='text-xl font-semibold cursor-pointer' onclick='toggleCollapse("q1")'>What is your return policy?</h3>
      <div id='q1' class='text-gray-700 hidden transition-all duration-300'>
        <p>You can return any item within 30 days of purchase for a full refund.</p>
      </div>
    </div>
    <div class='mb-4'>
      <h3 class='text-xl font-semibold cursor-pointer' onclick='toggleCollapse("q2")'>How do I track my order?</h3>
      <div id='q2' class='text-gray-700 hidden transition-all duration-300'>
        <p>You will receive a tracking number via email once your order ships.</p>
      </div>
    </div>
    <div class='mb-4'>
      <h3 class='text-xl font-semibold cursor-pointer' onclick='toggleCollapse("q3")'>Can I change my order?</h3>
      <div id='q3' class='text-gray-700 hidden transition-all duration-300'>
        <p>Yes, you can change your order within 24 hours of purchase.</p>
      </div>
    </div>
  </div>
</section>
```

## `faq` / `categorized`

### Example 1: Basic Categorized FAQ Section

**When To Use**: Use this layout for straightforward FAQ sections where questions are grouped by category, ideal for product or service pages.

**Why It Works**: The clear categorization allows users to quickly find relevant information. The use of contrasting colors and ample spacing enhances readability and engagement.

**Tailwind Notes**:
- Use of 'bg-gray-100' for a subtle background to differentiate the FAQ section.
- 'mb-6' provides consistent spacing between categories.
- 'hover:bg-gray-200' gives interactive feedback on question items.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Frequently Asked Questions</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-6'><div class='bg-white shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Category 1</h3><div class='space-y-4'><div class='cursor-pointer hover:bg-gray-200 p-4 rounded'><strong>What is your return policy?</strong><p class='text-gray-600'>You can return items within 30 days...</p></div><div class='cursor-pointer hover:bg-gray-200 p-4 rounded'><strong>How do I track my order?</strong><p class='text-gray-600'>You can track your order through...</p></div></div></div><div class='bg-white shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Category 2</h3><div class='space-y-4'><div class='cursor-pointer hover:bg-gray-200 p-4 rounded'><strong>What payment methods do you accept?</strong><p class='text-gray-600'>We accept all major credit cards...</p></div><div class='cursor-pointer hover:bg-gray-200 p-4 rounded'><strong>How can I contact support?</strong><p class='text-gray-600'>You can reach us via...</p></div></div></div></div></div></section>
```

### Example 2: Enhanced Categorized FAQ with Icons

**When To Use**: Ideal for more visually engaging FAQ sections, especially when you want to add a touch of branding with icons.

**Why It Works**: The inclusion of icons next to questions enhances visual interest and helps users quickly identify topics. The layout is responsive, ensuring a good experience on all devices.

**Tailwind Notes**:
- 'flex items-center' aligns icons and text neatly.
- 'bg-blue-50' provides a calming background that contrasts with the white cards.
- 'transition duration-200 ease-in-out transform hover:scale-105' adds a subtle animation on hover.

```html
<section class='py-12 bg-blue-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Frequently Asked Questions</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6'><div class='flex items-center mb-4'><svg class='w-6 h-6 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z'/></svg><h3 class='text-xl font-semibold ml-2'>Returns</h3></div><div class='space-y-4'><div class='cursor-pointer hover:bg-gray-200 p-4 rounded'><strong>What is your return policy?</strong><p class='text-gray-600'>You can return items within 30 days...</p></div></div></div><div class='bg-white shadow-lg rounded-lg p-6'><div class='flex items-center mb-4'><svg class='w-6 h-6 text-blue-500' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z'/></svg><h3 class='text-xl font-semibold ml-2'>Shipping</h3></div><div class='space-y-4'><div class='cursor-pointer hover:bg-gray-200 p-4 rounded'><strong>How do I track my order?</strong><p class='text-gray-600'>You can track your order through...</p></div></div></div></div></div></section>
```

## `faq` / `tabs`

### Example 1: Basic FAQ Tabs

**When To Use**: Use this layout for a straightforward FAQ section where users can switch between different topics easily.

**Why It Works**: The layout promotes clarity and ease of navigation, allowing users to quickly find answers to their questions. The use of contrasting colors for the active tab enhances usability.

**Tailwind Notes**:
- Utilizes flexbox for horizontal tab layout.
- Employs responsive design for mobile compatibility.
- Incorporates active state styling for better user experience.

```html
<section class="py-10 bg-gray-50">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">Frequently Asked Questions</h2>
    <div class="flex space-x-4 mb-4">
      <button class="flex-1 py-2 text-lg font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">General</button>
      <button class="flex-1 py-2 text-lg font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Billing</button>
      <button class="flex-1 py-2 text-lg font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Technical</button>
    </div>
    <div class="p-6 bg-white rounded-lg shadow">
      <h3 class="text-xl font-semibold text-gray-800">What is your return policy?</h3>
      <p class="mt-2 text-gray-600">Our return policy lasts 30 days...</p>
    </div>
  </div>
</section>
```

### Example 2: Stylized FAQ Tabs with Icons

**When To Use**: Use this layout when you want to add visual interest and enhance user engagement with icons representing each tab.

**Why It Works**: The use of icons alongside text makes the tabs more visually appealing and helps users quickly identify the content type. The contrasting colors for the active tab provide clear feedback.

**Tailwind Notes**:
- Icons improve visual hierarchy and recognition.
- Hover effects enhance interactivity.
- Responsive design ensures usability on all devices.

```html
<section class="py-12 bg-white">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-center text-gray-900 mb-8">FAQs</h2>
    <div class="flex justify-center space-x-6 mb-6">
      <button class="flex items-center space-x-2 py-3 px-4 text-lg font-medium text-gray-800 bg-blue-100 rounded-lg shadow hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z"/></svg>
        <span>General</span>
      </button>
      <button class="flex items-center space-x-2 py-3 px-4 text-lg font-medium text-gray-800 bg-white rounded-lg shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z"/></svg>
        <span>Billing</span>
      </button>
      <button class="flex items-center space-x-2 py-3 px-4 text-lg font-medium text-gray-800 bg-white rounded-lg shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z"/></svg>
        <span>Technical</span>
      </button>
    </div>
    <div class="p-6 bg-gray-50 rounded-lg shadow">
      <h3 class="text-xl font-semibold text-gray-800">What payment methods do you accept?</h3>
      <p class="mt-2 text-gray-600">We accept all major credit cards...</p>
    </div>
  </div>
</section>
```

## `objection-handling` / `cards`

### Example 1: Common Objections Addressed

**When To Use**: When you want to proactively address potential customer objections in a visually engaging manner.

**Why It Works**: This layout uses cards to compartmentalize objections, making it easy for users to digest information. The use of contrasting colors for the CTA buttons draws attention, while the consistent spacing and typography ensure a polished look.

**Tailwind Notes**:
- Cards provide a clear visual hierarchy, separating each objection distinctly.
- Responsive grid layout adapts to various screen sizes, maintaining usability.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Common Objections Addressed</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Price Concerns</h3><p class='text-gray-700 mb-4'>Our product offers exceptional value for the price, ensuring you get the best return on investment.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Quality Assurance</h3><p class='text-gray-700 mb-4'>We guarantee top-notch quality, backed by our industry-leading warranty.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div><div class='bg-white shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Customer Support</h3><p class='text-gray-700 mb-4'>Our dedicated support team is available 24/7 to assist you with any queries.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div></div></section>
```

### Example 2: Overcoming Hesitations

**When To Use**: When you want to provide reassurance to potential customers who may hesitate due to common objections.

**Why It Works**: The use of imagery alongside text in the cards enhances emotional engagement. The layout is designed to be visually appealing and easy to navigate, with clear CTAs that encourage user interaction.

**Tailwind Notes**:
- Images add visual interest and help convey messages more effectively.
- Hover effects on buttons enhance user experience and provide feedback.

```html
<section class='py-12 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Overcoming Hesitations</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'><div class='bg-gray-100 rounded-lg shadow-lg p-6'><img src='https://via.placeholder.com/150' alt='Price Concerns' class='mb-4 rounded-md'><h3 class='text-xl font-semibold mb-2'>Price Concerns</h3><p class='text-gray-600'>Discover how our pricing structure provides unmatched value.</p><a href='#' class='mt-4 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition'>Explore</a></div><div class='bg-gray-100 rounded-lg shadow-lg p-6'><img src='https://via.placeholder.com/150' alt='Quality Assurance' class='mb-4 rounded-md'><h3 class='text-xl font-semibold mb-2'>Quality Assurance</h3><p class='text-gray-600'>Learn about our quality checks and guarantees.</p><a href='#' class='mt-4 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition'>Explore</a></div><div class='bg-gray-100 rounded-lg shadow-lg p-6'><img src='https://via.placeholder.com/150' alt='Customer Support' class='mb-4 rounded-md'><h3 class='text-xl font-semibold mb-2'>Customer Support</h3><p class='text-gray-600'>See how we support our customers every step of the way.</p><a href='#' class='mt-4 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition'>Explore</a></div><div class='bg-gray-100 rounded-lg shadow-lg p-6'><img src='https://via.placeholder.com/150' alt='Satisfaction Guarantee' class='mb-4 rounded-md'><h3 class='text-xl font-semibold mb-2'>Satisfaction Guarantee</h3><p class='text-gray-600'>Find out about our no-risk guarantee policy.</p><a href='#' class='mt-4 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition'>Explore</a></div></div></div></section>
```

## `objection-handling` / `qna`

### Example 1: FAQ Section with Accordion Style

**When To Use**: Use this layout when you want to address common objections in a clear, interactive format that encourages user engagement.

**Why It Works**: The accordion style allows users to expand only the questions they are interested in, keeping the interface clean while providing detailed answers. This reduces cognitive load and enhances user experience.

**Tailwind Notes**:
- Utilizes rounded corners and shadow for a card-like feel.
- Spacing is optimized for readability and interaction.
- Hover effects on questions improve interactivity.

```html
<section class='py-12 bg-gray-100'><div class='max-w-4xl mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Frequently Asked Questions</h2><div class='space-y-4'><div class='bg-white shadow-md rounded-lg'><button class='flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500' onclick='this.nextElementSibling.classList.toggle("hidden")'><span class='font-semibold'>What is your return policy?</span><span class='text-gray-500'>+</span></button><div class='hidden p-4 border-t border-gray-200'>Our return policy lasts 30 days...</div></div><div class='bg-white shadow-md rounded-lg'><button class='flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500' onclick='this.nextElementSibling.classList.toggle("hidden")'><span class='font-semibold'>Do you offer customer support?</span><span class='text-gray-500'>+</span></button><div class='hidden p-4 border-t border-gray-200'>Yes, we offer 24/7 customer support...</div></div></div></div></section>
```

### Example 2: Grid Layout for Q&A Cards

**When To Use**: Ideal for showcasing multiple objections and answers in a visually engaging grid format, perfect for landing pages with multiple points to address.

**Why It Works**: The grid layout allows for a clean presentation of multiple questions and answers, making it easy for users to scan through their options. The use of hover effects adds interactivity, while consistent spacing maintains a polished look.

**Tailwind Notes**:
- Grid layout ensures responsiveness and adaptability to different screen sizes.
- Hover effects on cards enhance user engagement.
- Consistent padding and margin create a cohesive design.

```html
<section class='py-12 bg-gray-50'><div class='max-w-6xl mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Your Questions, Answered</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'><h3 class='text-lg font-semibold'>What payment methods do you accept?</h3><p class='text-gray-600 mt-2'>We accept all major credit cards, PayPal, and bank transfers.</p></div><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'><h3 class='text-lg font-semibold'>How long does shipping take?</h3><p class='text-gray-600 mt-2'>Shipping typically takes 5-7 business days.</p></div><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'><h3 class='text-lg font-semibold'>Can I track my order?</h3><p class='text-gray-600 mt-2'>Yes, you will receive a tracking number via email once your order ships.</p></div></div></div></section>
```

## `objection-handling` / `comparison`

### Example 1: Feature Comparison Table

**When To Use**: Use this layout when you need to clearly delineate features of your product against competitors, highlighting your advantages.

**Why It Works**: The use of a grid layout with distinct columns for each product creates a clear visual hierarchy. The contrasting background colors emphasize your product's features, while the bold typography draws attention to key points.

**Tailwind Notes**:
- Utilizes grid layout for structured comparison.
- Contrast colors to differentiate your product from competitors.
- Responsive design ensures usability on all devices.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Compare Features</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold'>Our Product</h3><ul class='mt-4'><li class='flex items-center mb-2'><span class='text-green-500 mr-2'>✔️</span> Feature A</li><li class='flex items-center mb-2'><span class='text-green-500 mr-2'>✔️</span> Feature B</li><li class='flex items-center mb-2'><span class='text-green-500 mr-2'>✔️</span> Feature C</li></ul><a href='#' class='mt-6 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>Get Started</a></div><div class='bg-gray-200 shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold'>Competitor A</h3><ul class='mt-4'><li class='flex items-center mb-2'><span class='text-red-500 mr-2'>❌</span> Feature A</li><li class='flex items-center mb-2'><span class='text-red-500 mr-2'>✔️</span> Feature B</li><li class='flex items-center mb-2'><span class='text-red-500 mr-2'>❌</span> Feature C</li></ul></div><div class='bg-gray-200 shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold'>Competitor B</h3><ul class='mt-4'><li class='flex items-center mb-2'><span class='text-red-500 mr-2'>✔️</span> Feature A</li><li class='flex items-center mb-2'><span class='text-red-500 mr-2'>❌</span> Feature B</li><li class='flex items-center mb-2'><span class='text-red-500 mr-2'>✔️</span> Feature C</li></ul></div></div></div></section>
```

### Example 2: Side-by-Side Comparison Cards

**When To Use**: Ideal for showcasing a direct comparison between your product and a competitor in a visually engaging manner.

**Why It Works**: The card layout allows for easy scanning of information, while the use of color and spacing helps to create a clean and organized appearance. The prominent CTA encourages user engagement.

**Tailwind Notes**:
- Cards provide a clear visual separation of content.
- Consistent spacing improves readability.
- Hover effects enhance interactivity.

```html
<section class='py-12 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Compare Us to Others</h2><div class='flex flex-col md:flex-row justify-center gap-8'><div class='bg-blue-500 text-white rounded-lg shadow-lg p-6 flex-1'><h3 class='text-xl font-semibold'>Our Product</h3><p class='mt-4'>Best in class features that outshine competitors.</p><a href='#' class='mt-6 block text-center bg-white text-blue-500 py-2 rounded hover:bg-blue-600 hover:text-white'>Try Free</a></div><div class='bg-gray-300 rounded-lg shadow-lg p-6 flex-1'><h3 class='text-xl font-semibold'>Competitor A</h3><p class='mt-4'>Limited features that may not meet your needs.</p></div><div class='bg-gray-300 rounded-lg shadow-lg p-6 flex-1'><h3 class='text-xl font-semibold'>Competitor B</h3><p class='mt-4'>Higher prices with fewer benefits.</p></div></div></div></section>
```

## `myth-vs-fact` / `split-list`

### Example 1: Myth vs Fact on Health Supplements

**When To Use**: Use this layout to debunk common myths about health supplements while providing factual information.

**Why It Works**: The split-list format creates a clear visual distinction between myths and facts, enhancing readability and engagement. The use of contrasting colors and typography emphasizes key points, making it easy for users to digest information quickly.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs contrasting background colors for visual separation.
- Includes ample padding and margin for clean spacing.
- Uses bold typography for emphasis on key terms.

```html
<section class="py-12 bg-gray-50">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Myth vs Fact</h2>
    <div class="flex flex-col md:flex-row">
      <div class="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 mb-6 md:mb-0">
        <h3 class="text-xl font-semibold text-red-600">Myth</h3>
        <ul class="list-disc list-inside mt-4">
          <li class="mb-2">All supplements are unnecessary.</li>
          <li class="mb-2">Natural means safe.</li>
          <li class="mb-2">More is better when it comes to vitamins.</li>
        </ul>
      </div>
      <div class="w-full md:w-1/2 bg-green-100 shadow-lg rounded-lg p-6">
        <h3 class="text-xl font-semibold text-green-700">Fact</h3>
        <ul class="list-disc list-inside mt-4">
          <li class="mb-2">Some supplements can fill dietary gaps.</li>
          <li class="mb-2">Natural doesn't always mean safe; consult a professional.</li>
          <li class="mb-2">Dosage matters; follow recommended guidelines.</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Common Myths in Digital Marketing

**When To Use**: Ideal for clarifying misconceptions in digital marketing strategies, helping potential clients understand the truth.

**Why It Works**: This layout effectively contrasts the myths and facts, using color and typography to guide the reader's focus. The clear hierarchy and responsive design ensure that the content is accessible on all devices, enhancing user experience.

**Tailwind Notes**:
- Responsive design with flexbox for mobile-first approach.
- Clear color differentiation between myths and facts.
- Consistent use of typography for a professional look.
- Effective use of whitespace to avoid clutter.

```html
<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-bold text-center text-gray-800 mb-10">Myths vs Facts in Digital Marketing</h2>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-1 bg-gray-200 p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-red-600">Myths</h3>
        <ul class="mt-4 space-y-4">
          <li>SEO is a one-time task.</li>
          <li>Social media is only for brand awareness.</li>
          <li>Email marketing is dead.</li>
        </ul>
      </div>
      <div class="flex-1 bg-green-50 p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-green-700">Facts</h3>
        <ul class="mt-4 space-y-4">
          <li>SEO requires ongoing effort and updates.</li>
          <li>Social media can drive sales and engagement.</li>
          <li>Email marketing remains one of the most effective channels.</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

## `myth-vs-fact` / `cards`

### Example 1: Myth vs Fact Cards with Emphasis on Clarity

**When To Use**: Use when you want to debunk common misconceptions in a visually engaging way, suitable for educational content or product marketing.

**Why It Works**: The use of contrasting colors, clear typography, and ample spacing makes the information easy to digest and visually appealing. The call-to-action is prominent, encouraging user engagement.

**Tailwind Notes**:
- Utilizes a grid layout for responsive design.
- Emphasizes contrast between myth and fact cards for clarity.
- Incorporates hover effects for interactivity.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Myths vs Facts</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow'><h3 class='text-xl font-semibold text-red-600'>Myth</h3><p class='mt-2 text-gray-700'>Common misconception about the topic.</p></div><div class='bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow'><h3 class='text-xl font-semibold text-green-600'>Fact</h3><p class='mt-2 text-gray-700'>Clarifying fact that debunks the myth.</p></div></div><div class='text-center mt-8'><a href='#' class='bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition'>Learn More</a></div></div></section>
```

### Example 2: Interactive Myth vs Fact Cards for User Engagement

**When To Use**: Ideal for websites aiming to engage users through interactive content, such as quizzes or educational resources.

**Why It Works**: Interactive elements with hover effects and responsive design encourage users to explore more. The clear hierarchy and distinct card designs enhance understanding and retention.

**Tailwind Notes**:
- Responsive grid layout adapts to screen sizes.
- Hover effects enhance interactivity and user experience.
- Utilizes padding and margins for a clean layout.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-4xl font-bold text-center mb-10'>Debunking Myths</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'><div class='bg-gray-200 rounded-lg p-5 transition-transform transform hover:scale-105'><h3 class='text-lg font-bold text-red-600'>Myth</h3><p class='mt-2 text-gray-800'>This is a common myth.</p></div><div class='bg-gray-200 rounded-lg p-5 transition-transform transform hover:scale-105'><h3 class='text-lg font-bold text-green-600'>Fact</h3><p class='mt-2 text-gray-800'>This is the fact that corrects the myth.</p></div></div><div class='text-center mt-8'><a href='#' class='bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition'>Discover More</a></div></div></section>
```

## `myth-vs-fact` / `table`

### Example 1: Myth vs Fact Comparison Table

**When To Use**: Use this layout to clearly present myths alongside their factual counterparts, ideal for educational content.

**Why It Works**: The clear separation of myths and facts enhances readability, while contrasting colors draw attention to key information. The responsive design ensures usability across devices.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs contrasting colors for myths and facts for visual clarity.
- Generous padding and margin create a spacious feel.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Myths vs Facts</h2><div class='overflow-x-auto'><table class='min-w-full bg-white shadow-md rounded-lg'><thead><tr class='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'><th class='py-3 px-6 text-left'>Myth</th><th class='py-3 px-6 text-left'>Fact</th></tr></thead><tbody class='text-gray-600 text-sm font-light'><tr class='border-b border-gray-200 hover:bg-gray-100'><td class='py-3 px-6'>Myth 1</td><td class='py-3 px-6'>Fact 1</td></tr><tr class='border-b border-gray-200 hover:bg-gray-100'><td class='py-3 px-6'>Myth 2</td><td class='py-3 px-6'>Fact 2</td></tr><tr class='border-b border-gray-200 hover:bg-gray-100'><td class='py-3 px-6'>Myth 3</td><td class='py-3 px-6'>Fact 3</td></tr></tbody></table></div></div></section>
```

### Example 2: Highlighted Myths and Facts Table

**When To Use**: Ideal for marketing pages that need to debunk common misconceptions while promoting factual information.

**Why It Works**: The use of background colors and hover effects makes the content engaging. The clear headings and ample whitespace improve scanning and comprehension.

**Tailwind Notes**:
- Uses background colors to highlight sections.
- Hover effects enhance interactivity.
- Responsive table design for mobile-friendliness.

```html
<section class='py-12 bg-blue-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Debunking Myths</h2><div class='overflow-x-auto'><table class='min-w-full bg-white shadow-lg rounded-lg'><thead><tr class='bg-blue-600 text-white uppercase text-sm leading-normal'><th class='py-3 px-6 text-left'>Myth</th><th class='py-3 px-6 text-left'>Fact</th></tr></thead><tbody class='text-gray-800 text-sm font-light'><tr class='border-b border-gray-200 hover:bg-blue-100'><td class='py-3 px-6'>Myth A</td><td class='py-3 px-6'>Fact A</td></tr><tr class='border-b border-gray-200 hover:bg-blue-100'><td class='py-3 px-6'>Myth B</td><td class='py-3 px-6'>Fact B</td></tr><tr class='border-b border-gray-200 hover:bg-blue-100'><td class='py-3 px-6'>Myth C</td><td class='py-3 px-6'>Fact C</td></tr></tbody></table></div></div></section>
```

## `cta-band` / `centered`

### Example 1: Promotional Call to Action

**When To Use**: Use this example for a promotional campaign or limited-time offer to grab user attention.

**Why It Works**: The bold typography and contrasting colors create a strong visual hierarchy, making the CTA stand out. The generous padding ensures the content feels spacious and inviting, while the clear button styles encourage user interaction.

**Tailwind Notes**:
- Utilizes 'bg-blue-600' for a strong background color that draws attention.
- Employs 'text-white' for high contrast against the background, enhancing readability.
- Incorporates 'py-12 px-6' for ample spacing, creating a polished look.

```html
<section class='bg-blue-600 text-white py-12 px-6 text-center'>
  <h2 class='text-3xl font-bold mb-4'>Unlock Your Potential!</h2>
  <p class='mb-6'>Join us today and take the first step towards a brighter future.</p>
  <div class='flex justify-center space-x-4'>
    <a href='#' class='bg-white text-blue-600 font-semibold py-2 px-4 rounded shadow hover:bg-blue-50 transition'>Get Started</a>
    <a href='#' class='bg-gray-800 text-white font-semibold py-2 px-4 rounded shadow hover:bg-gray-700 transition'>Learn More</a>
  </div>
</section>
```

### Example 2: Service Promotion with Visuals

**When To Use**: Ideal for showcasing a service with accompanying imagery or icons to enhance the message.

**Why It Works**: The use of imagery alongside text creates a more engaging experience. The layout is responsive, ensuring it looks great on all devices. The button styles are consistent, reinforcing brand identity and encouraging action.

**Tailwind Notes**:
- Incorporates 'flex flex-col md:flex-row' for responsive layout adjustments.
- Uses 'mb-8' for spacing between elements, ensuring clarity.
- Applies 'rounded-lg' for buttons, which softens the look and feels modern.

```html
<section class='bg-white py-12 px-6 text-center md:flex md:items-center md:justify-between'>
  <div class='md:w-1/2 md:pr-6'>
    <h2 class='text-3xl font-bold mb-4'>Transform Your Business</h2>
    <p class='mb-6'>Our services are designed to help you thrive in a competitive landscape.</p>
    <div class='flex justify-center space-x-4'>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition'>Get Started</a>
      <a href='#' class='bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-300 transition'>Discover More</a>
    </div>
  </div>
  <div class='mt-6 md:mt-0 md:w-1/2'>
    <img src='service-image.jpg' alt='Service Image' class='w-full h-auto rounded-lg shadow-lg'>
  </div>
</section>
```

### Example 3: Event Registration Call to Action

**When To Use**: Perfect for promoting an event with a clear registration prompt.

**Why It Works**: This layout emphasizes urgency and excitement with vibrant colors and dynamic typography. The buttons are designed to stand out, prompting immediate action, while the responsive design ensures accessibility on all devices.

**Tailwind Notes**:
- Uses 'bg-red-500' for a vibrant, attention-grabbing background.
- Applies 'text-2xl' for the heading to ensure visibility.
- Incorporates 'transition' classes for smooth hover effects on buttons.

```html
<section class='bg-red-500 text-white py-12 px-6 text-center'>
  <h2 class='text-4xl font-bold mb-4'>Join Our Annual Conference!</h2>
  <p class='mb-6'>Register now and secure your spot at the event of the year.</p>
  <div class='flex justify-center space-x-4'>
    <a href='#' class='bg-white text-red-500 font-semibold py-2 px-4 rounded shadow hover:bg-gray-200 transition'>Register Now</a>
    <a href='#' class='bg-gray-800 text-white font-semibold py-2 px-4 rounded shadow hover:bg-gray-700 transition'>Learn More</a>
  </div>
</section>
```

## `cta-band` / `dual`

### Example 1: Promotional Offer CTA

**When To Use**: Use this layout to highlight a limited-time promotional offer, encouraging users to take action quickly.

**Why It Works**: The strong contrast between the background and text, along with clear CTAs, draws attention to the offer. The dual-button design allows for different user actions, increasing engagement.

**Tailwind Notes**:
- Use of bg-gradient for a modern look.
- Flexbox ensures buttons are evenly spaced and centered.

```html
<section class="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-12 px-6 text-center">
  <h2 class="text-3xl font-bold mb-4">Limited Time Offer!</h2>
  <p class="mb-6">Get 50% off your first purchase when you sign up today.</p>
  <div class="flex justify-center space-x-4">
    <a href="#" class="bg-white text-blue-500 font-semibold py-3 px-6 rounded shadow hover:bg-gray-100 transition">Sign Up Now</a>
    <a href="#" class="bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded hover:bg-white hover:text-blue-500 transition">Learn More</a>
  </div>
</section>
```

### Example 2: Service Comparison CTA

**When To Use**: Ideal for showcasing two different service options, encouraging users to choose between them.

**Why It Works**: The layout effectively compares two services with distinct buttons for each, making it easy for users to understand their options. The clear typography and ample spacing enhance readability.

**Tailwind Notes**:
- Grid layout ensures equal space for both services.
- Consistent padding and margin create a balanced appearance.

```html
<section class="py-12 px-6 bg-gray-100 text-center">
  <h2 class="text-3xl font-bold mb-8">Choose Your Plan</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4">Basic Plan</h3>
      <p class="mb-4">Perfect for individuals and small teams.</p>
      <a href="#" class="block bg-blue-500 text-white text-center font-semibold py-3 rounded hover:bg-blue-600 transition">Select Basic</a>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4">Pro Plan</h3>
      <p class="mb-4">Best for larger teams and advanced features.</p>
      <a href="#" class="block bg-blue-500 text-white text-center font-semibold py-3 rounded hover:bg-blue-600 transition">Select Pro</a>
    </div>
  </div>
</section>
```

### Example 3: Event Registration CTA

**When To Use**: Use this design to promote an upcoming event, encouraging users to register or learn more.

**Why It Works**: The use of a vibrant background and large typography captures attention, while the dual buttons cater to different user intents. The layout is responsive, ensuring a good experience on all devices.

**Tailwind Notes**:
- Vibrant colors create an inviting atmosphere.
- Responsive design adapts to various screen sizes.

```html
<section class="bg-yellow-400 text-gray-800 py-12 px-6 text-center">
  <h2 class="text-4xl font-bold mb-4">Join Us for Our Annual Conference!</h2>
  <p class="mb-6">Don't miss out on insightful talks and networking opportunities.</p>
  <div class="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
    <a href="#" class="bg-gray-800 text-white font-semibold py-3 px-6 rounded shadow hover:bg-gray-700 transition">Register Now</a>
    <a href="#" class="bg-transparent border-2 border-gray-800 text-gray-800 font-semibold py-3 px-6 rounded hover:bg-gray-800 hover:text-white transition">Learn More</a>
  </div>
</section>
```

## `cta-band` / `contact-strip`

### Example 1: Simple Contact CTA

**When To Use**: Use this layout for a straightforward call-to-action that emphasizes contacting your business.

**Why It Works**: The clear hierarchy with a prominent heading and buttons encourages user engagement. The contrasting colors and generous spacing draw attention to the CTA.

**Tailwind Notes**:
- Utilizes flexbox for alignment and responsiveness.
- Strong contrast between background and text for readability.
- Ample padding for a spacious feel.

```html
<section class='bg-blue-600 text-white py-8 px-4 text-center'>
  <h2 class='text-3xl font-bold mb-4'>Get in Touch with Us!</h2>
  <p class='mb-6'>Have questions? We're here to help you.</p>
  <div class='flex justify-center space-x-4'>
    <a href='#' class='bg-white text-blue-600 font-semibold py-2 px-4 rounded shadow hover:bg-gray-200'>Contact Sales</a>
    <a href='#' class='bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded hover:bg-white hover:text-blue-600'>Support</a>
  </div>
</section>
```

### Example 2: Multi-Button Contact CTA

**When To Use**: Ideal for businesses offering multiple contact options, such as sales, support, and general inquiries.

**Why It Works**: The use of cards for each contact option creates a clean layout while allowing users to quickly identify their preferred method of contact. The distinct button styles maintain consistency and clarity.

**Tailwind Notes**:
- Grid layout for responsiveness and organization.
- Consistent button styles enhance usability.
- Hover effects improve interactivity.

```html
<section class='bg-gray-100 py-12 px-6'>
  <h2 class='text-4xl font-bold text-center mb-8'>Reach Out to Us</h2>
  <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
    <div class='bg-white p-6 rounded-lg shadow-lg text-center'>
      <h3 class='text-xl font-semibold mb-2'>Sales Inquiry</h3>
      <p class='mb-4'>Talk to our sales team to learn more.</p>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Contact Sales</a>
    </div>
    <div class='bg-white p-6 rounded-lg shadow-lg text-center'>
      <h3 class='text-xl font-semibold mb-2'>Customer Support</h3>
      <p class='mb-4'>Need help? We're here for you.</p>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Get Support</a>
    </div>
    <div class='bg-white p-6 rounded-lg shadow-lg text-center'>
      <h3 class='text-xl font-semibold mb-2'>General Inquiries</h3>
      <p class='mb-4'>Have questions? Ask away!</p>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Contact Us</a>
    </div>
  </div>
</section>
```

### Example 3: Promotional Contact CTA

**When To Use**: Best for marketing campaigns where you want to highlight a special offer or promotion alongside contact options.

**Why It Works**: The use of a vibrant background color and bold typography captures attention, while the clear CTA buttons are easy to spot. The layout is responsive and visually appealing, making it effective for conversions.

**Tailwind Notes**:
- Bright background color for promotional emphasis.
- Large text for immediate visibility.
- Responsive design ensures accessibility across devices.

```html
<section class='bg-yellow-400 text-gray-800 py-10 px-5'>
  <h2 class='text-3xl font-bold text-center mb-4'>Limited Time Offer!</h2>
  <p class='text-center mb-6'>Contact us today and get 20% off your first purchase!</p>
  <div class='flex justify-center space-x-4'>
    <a href='#' class='bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-700'>Claim Offer</a>
    <a href='#' class='bg-transparent border-2 border-gray-800 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-800 hover:text-white'>Learn More</a>
  </div>
</section>
```

## `cta-band` / `whatsapp-focused`

### Example 1: Engaging WhatsApp CTA

**When To Use**: Use this CTA section when you want to encourage users to connect via WhatsApp for immediate support or inquiries.

**Why It Works**: The strong contrast between the background and text draws attention, while the prominent button encourages immediate action. The use of rounded corners and shadows adds depth, making the section feel approachable.

**Tailwind Notes**:
- Utilizes responsive padding and margins for mobile optimization.
- The button uses a bright color to stand out against the background.

```html
<section class='bg-green-500 text-white py-12 px-4 md:px-8 text-center'>
  <h2 class='text-3xl md:text-4xl font-bold mb-4'>Need Help? Chat with Us on WhatsApp!</h2>
  <p class='mb-6'>Our team is ready to assist you instantly.</p>
  <a href='https://wa.me/1234567890' class='bg-white text-green-500 font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 hover:bg-gray-200'>Chat Now</a>
</section>
```

### Example 2: Promotional WhatsApp Offer

**When To Use**: Ideal for marketing campaigns where you want to promote a special offer or service through WhatsApp.

**Why It Works**: The use of a gradient background adds a modern touch, while the clear hierarchy in typography emphasizes the offer. The buttons are large and easy to tap on mobile devices, ensuring accessibility.

**Tailwind Notes**:
- Gradient background enhances visual interest.
- Incorporates responsive typography for better readability across devices.

```html
<section class='bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-4 md:px-10 text-center'>
  <h2 class='text-4xl font-bold mb-2'>Exclusive Offer Just for You!</h2>
  <p class='mb-8'>Chat with us on WhatsApp and get 20% off your first order.</p>
  <a href='https://wa.me/1234567890' class='bg-white text-blue-600 font-semibold py-4 px-8 rounded-lg shadow-md transition duration-300 hover:bg-gray-200'>Claim Offer</a>
</section>
```

### Example 3: WhatsApp Customer Support Section

**When To Use**: Use this layout when you want to provide users with multiple options for support via WhatsApp, including FAQs or contact information.

**Why It Works**: The card layout organizes information effectively, making it easy for users to find what they need. The use of icons and distinct colors for each card enhances visual hierarchy and engagement.

**Tailwind Notes**:
- Card layout provides a clean and organized presentation.
- Utilizes flexbox for responsive card arrangement.

```html
<section class='bg-white py-12 px-4 md:px-8'>
  <h2 class='text-3xl font-bold text-center mb-6'>Got Questions? We're Here to Help!</h2>
  <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
    <div class='bg-green-100 p-6 rounded-lg shadow-md'>
      <h3 class='font-semibold text-lg mb-2'>General Inquiries</h3>
      <p class='mb-4'>Have questions? Reach out to us on WhatsApp!</p>
      <a href='https://wa.me/1234567890' class='bg-green-500 text-white font-semibold py-2 px-4 rounded-lg'>Chat Now</a>
    </div>
    <div class='bg-blue-100 p-6 rounded-lg shadow-md'>
      <h3 class='font-semibold text-lg mb-2'>Order Status</h3>
      <p class='mb-4'>Check your order status instantly via WhatsApp.</p>
      <a href='https://wa.me/1234567890' class='bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg'>Track Order</a>
    </div>
    <div class='bg-purple-100 p-6 rounded-lg shadow-md'>
      <h3 class='font-semibold text-lg mb-2'>Feedback</h3>
      <p class='mb-4'>We value your feedback! Chat with us on WhatsApp.</p>
      <a href='https://wa.me/1234567890' class='bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg'>Give Feedback</a>
    </div>
  </div>
</section>
```

## `cta-band` / `demo`

### Example 1: Promotional Demo CTA

**When To Use**: Use this section to highlight a product demo that encourages users to sign up or learn more.

**Why It Works**: The bold heading and contrasting buttons draw attention, while the clean layout and ample white space create a polished appearance. The responsive design ensures usability across devices.

**Tailwind Notes**:
- Use of bg-blue-600 for a strong visual impact.
- Text-white for high contrast against the background.
- Flexbox for centering content and ensuring responsiveness.

```html
<section class='bg-blue-600 text-white py-12 px-4 text-center'>
  <h2 class='text-3xl font-bold mb-4'>See Our Product in Action!</h2>
  <p class='mb-6'>Join us for a free demo and discover how our solution can help you.</p>
  <div class='flex justify-center space-x-4'>
    <a href='#' class='bg-white text-blue-600 font-semibold py-2 px-4 rounded shadow hover:bg-gray-200'>Schedule a Demo</a>
    <a href='#' class='bg-transparent border border-white text-white font-semibold py-2 px-4 rounded hover:bg-white hover:text-blue-600'>Learn More</a>
  </div>
</section>
```

### Example 2: Feature-Rich Demo CTA

**When To Use**: Ideal for showcasing multiple features or services with distinct calls to action.

**Why It Works**: The grid layout presents features in a visually appealing way, while the consistent use of colors and spacing maintains a cohesive design. The buttons are clearly defined and encourage user action.

**Tailwind Notes**:
- Grid layout for feature cards ensures organized presentation.
- Consistent padding and margin for visual balance.
- Hover effects on buttons enhance interactivity.

```html
<section class='bg-gray-100 py-12 px-4'>
  <h2 class='text-3xl font-bold text-center mb-8'>Explore Our Features</h2>
  <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
    <div class='bg-white p-6 rounded-lg shadow-lg text-center'>
      <h3 class='text-xl font-semibold mb-2'>Feature One</h3>
      <p class='mb-4'>A brief description of the feature.</p>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Try It Now</a>
    </div>
    <div class='bg-white p-6 rounded-lg shadow-lg text-center'>
      <h3 class='text-xl font-semibold mb-2'>Feature Two</h3>
      <p class='mb-4'>A brief description of the feature.</p>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Try It Now</a>
    </div>
    <div class='bg-white p-6 rounded-lg shadow-lg text-center'>
      <h3 class='text-xl font-semibold mb-2'>Feature Three</h3>
      <p class='mb-4'>A brief description of the feature.</p>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Try It Now</a>
    </div>
  </div>
</section>
```

## `cta-band` / `booking`

### Example 1: Simple Booking Call-to-Action

**When To Use**: Use this design when you want to encourage users to book a service or product with a clear and straightforward message.

**Why It Works**: The layout emphasizes the heading and buttons, creating a strong visual hierarchy. The use of contrasting colors for the buttons makes them stand out, driving user action.

**Tailwind Notes**:
- Uses a bold heading for emphasis.
- The background color contrasts well with the text and buttons.
- Generous padding ensures the section feels spacious.

```html
<section class='bg-blue-600 text-white py-12 px-4 text-center'>
  <h2 class='text-3xl font-bold mb-4'>Book Your Adventure Today!</h2>
  <p class='mb-6'>Experience the thrill of a lifetime with our exclusive packages.</p>
  <div class='flex justify-center space-x-4'>
    <a href='#' class='bg-white text-blue-600 font-semibold py-2 px-6 rounded shadow hover:bg-gray-200 transition'>Book Now</a>
    <a href='#' class='bg-transparent border border-white text-white font-semibold py-2 px-6 rounded hover:bg-white hover:text-blue-600 transition'>Learn More</a>
  </div>
</section>
```

### Example 2: Promotional Booking Section with Image

**When To Use**: Ideal for showcasing a specific offer or promotion alongside a visual element to capture attention.

**Why It Works**: The integration of an image alongside the text creates a balanced layout, enhancing visual interest. The buttons are distinct and encourage interaction, while the responsive design ensures usability across devices.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Image adds context and appeal to the offer.
- Text contrast and button styles enhance clickability.

```html
<section class='flex flex-col md:flex-row items-center bg-gray-100 py-12 px-4'>
  <div class='md:w-1/2 mb-6 md:mb-0'>
    <h2 class='text-3xl font-bold text-gray-800 mb-4'>Limited Time Offer!</h2>
    <p class='text-gray-600 mb-6'>Book now and save 20% on your first booking!</p>
    <div class='flex space-x-4'>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow hover:bg-blue-700 transition'>Book Now</a>
      <a href='#' class='bg-transparent border border-blue-600 text-blue-600 font-semibold py-2 px-6 rounded hover:bg-blue-600 hover:text-white transition'>Learn More</a>
    </div>
  </div>
  <div class='md:w-1/2'>
    <img src='offer-image.jpg' alt='Promotional Offer' class='w-full h-auto rounded-lg shadow-lg'>
  </div>
</section>
```

### Example 3: Grid of Booking Options

**When To Use**: Best for presenting multiple booking options or packages in a visually appealing grid format.

**Why It Works**: The grid layout allows users to easily compare different options. Each card has a clear call-to-action, and the use of hover effects encourages interaction. The overall design remains responsive and accessible.

**Tailwind Notes**:
- Grid layout provides clear organization of content.
- Hover effects enhance user engagement.
- Consistent card styling ensures uniformity.

```html
<section class='py-12 px-4 bg-white'>
  <h2 class='text-3xl font-bold text-center mb-8'>Choose Your Package</h2>
  <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
    <div class='border rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105'>
      <h3 class='text-xl font-semibold mb-4'>Adventure Package</h3>
      <p class='text-gray-600 mb-4'>Explore the wild with our guided tours.</p>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-4 rounded'>Book Now</a>
    </div>
    <div class='border rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105'>
      <h3 class='text-xl font-semibold mb-4'>Relaxation Package</h3>
      <p class='text-gray-600 mb-4'>Unwind with our spa and wellness retreats.</p>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-4 rounded'>Book Now</a>
    </div>
    <div class='border rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105'>
      <h3 class='text-xl font-semibold mb-4'>Family Package</h3>
      <p class='text-gray-600 mb-4'>Fun activities for the whole family.</p>
      <a href='#' class='bg-blue-600 text-white font-semibold py-2 px-4 rounded'>Book Now</a>
    </div>
  </div>
</section>
```

## `cta-band` / `urgency`

### Example 1: Limited Time Offer

**When To Use**: Use this example when promoting a time-sensitive offer that requires immediate action from users.

**Why It Works**: The bold typography and contrasting colors create a sense of urgency, while the clear CTA buttons are designed to stand out and encourage clicks.

**Tailwind Notes**:
- Use of `bg-red-600` for urgency and `text-white` for contrast.
- Responsive padding ensures the section looks good on all devices.
- Flexbox layout for alignment and spacing.

```html
<section class='bg-red-600 text-white py-12 px-6 md:px-12 flex flex-col items-center text-center'>
  <h2 class='text-3xl font-bold mb-4'>Limited Time Offer!</h2>
  <p class='mb-6'>Get 50% off your first purchase. Hurry, offer ends soon!</p>
  <div class='flex space-x-4'>
    <a href='#' class='bg-white text-red-600 font-semibold py-2 px-4 rounded shadow hover:bg-red-100'>Grab the Deal</a>
    <a href='#' class='bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded hover:bg-white hover:text-red-600'>Learn More</a>
  </div>
</section>
```

### Example 2: Flash Sale Alert

**When To Use**: Ideal for announcing a flash sale with a countdown timer to create urgency.

**Why It Works**: The use of a countdown timer adds a visual element that emphasizes urgency, while the layout is clean and straightforward, making it easy to read.

**Tailwind Notes**:
- Grid layout for responsiveness and clear hierarchy.
- Use of `bg-gradient-to-r` for a dynamic background effect.
- Large, bold typography ensures the message is prominent.

```html
<section class='bg-gradient-to-r from-blue-500 to-purple-600 text-white py-10 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 items-center'>
  <div>
    <h2 class='text-4xl font-extrabold mb-2'>Flash Sale!</h2>
    <p class='text-lg mb-4'>Only 3 hours left!</p>
    <div class='flex space-x-4'>
      <a href='#' class='bg-white text-blue-600 font-semibold py-2 px-4 rounded shadow hover:bg-blue-100'>Shop Now</a>
      <a href='#' class='bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded hover:bg-white hover:text-blue-600'>See Details</a>
    </div>
  </div>
  <div class='mt-6 md:mt-0'>
    <div class='text-center'>
      <span class='text-2xl font-bold'>03:00:00</span>
      <p class='text-sm'>Time Remaining</p>
    </div>
  </div>
</section>
```

### Example 3: Act Now for Exclusive Access

**When To Use**: Perfect for campaigns that offer exclusive content or services for a limited time.

**Why It Works**: The clear call-to-action buttons and organized layout guide the user’s attention, while the background and typography create a professional and appealing look.

**Tailwind Notes**:
- Utilization of `bg-gray-800` for a sleek, modern appearance.
- Contrast with white text ensures readability.
- Flexbox for responsive alignment of text and buttons.

```html
<section class='bg-gray-800 text-white py-16 px-6 md:px-12 flex flex-col items-center text-center'>
  <h2 class='text-3xl font-bold mb-4'>Act Now for Exclusive Access!</h2>
  <p class='mb-6'>Sign up today to unlock premium features.</p>
  <div class='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
    <a href='#' class='bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded shadow hover:bg-yellow-400'>Get Started</a>
    <a href='#' class='bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded hover:bg-white hover:text-gray-800'>Learn More</a>
  </div>
</section>
```

## `sticky-cta` / `bottom-bar`

### Example 1: Promotional Bottom Bar with Primary CTA

**When To Use**: Use this design for a landing page that promotes a specific product or service with a clear call to action.

**Why It Works**: The use of a bold background color creates a strong visual anchor for the bottom bar, while the large, contrasting button draws immediate attention to the primary action. The spacing ensures that the text and buttons are easily readable and accessible on mobile devices.

**Tailwind Notes**:
- bg-gray-800 for a strong contrast against light backgrounds
- text-white for readability and emphasis
- p-4 for comfortable padding around the content
- flex justify-between for a balanced layout

```html
<section class='bg-gray-800 text-white p-4 fixed bottom-0 left-0 right-0 flex justify-between items-center shadow-lg'>
  <div class='flex items-center'>
    <h2 class='text-lg font-semibold'>Don't miss our special offer!</h2>
  </div>
  <div>
    <a href='#' class='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Get Started</a>
  </div>
</section>
```

### Example 2: Informational Bottom Bar with Multiple CTAs

**When To Use**: Ideal for a marketing site that offers multiple actions, such as signing up for a newsletter or accessing a free trial.

**Why It Works**: This example uses a card-like layout to differentiate between different actions. The use of space between buttons and text improves clarity, while hover effects on buttons enhance interactivity. The responsive design ensures it looks good on all screen sizes.

**Tailwind Notes**:
- bg-white for a clean, modern look
- shadow-md to create a card effect
- flex-wrap for responsiveness on smaller screens
- space-x-4 for even spacing between buttons

```html
<section class='bg-white shadow-md p-4 fixed bottom-0 left-0 right-0 flex flex-wrap justify-between items-center'>
  <div class='flex items-center space-x-4'>
    <h2 class='text-lg font-semibold'>Join our community!</h2>
    <p class='text-gray-600'>Sign up for updates and offers.</p>
  </div>
  <div class='flex space-x-4'>
    <a href='#' class='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'>Free Trial</a>
    <a href='#' class='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>Newsletter</a>
  </div>
</section>
```

### Example 3: Urgent Call to Action Bottom Bar

**When To Use**: Best for time-sensitive promotions or announcements that require immediate attention from users.

**Why It Works**: The bright background color and bold typography create a sense of urgency, while the large button size ensures that it’s easily tappable on mobile devices. The use of icons enhances the message and makes the CTA more engaging.

**Tailwind Notes**:
- bg-red-600 for urgency and attention-grabbing
- text-white for high contrast and readability
- py-3 px-5 for a larger touch target
- flex items-center justify-between for a clear layout

```html
<section class='bg-red-600 text-white py-3 px-5 fixed bottom-0 left-0 right-0 flex items-center justify-between shadow-lg'>
  <div class='flex items-center'>
    <svg class='w-6 h-6 mr-2' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V4h2v7z'/></svg>
    <span class='font-semibold'>Limited Time Offer!</span>
  </div>
  <a href='#' class='bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded'>Claim Now</a>
</section>
```

## `sticky-cta` / `floating-pill`

### Example 1: Floating CTA with Product Highlights

**When To Use**: When you want to draw attention to key product features while providing a clear call-to-action.

**Why It Works**: The floating pill design creates a sense of urgency and accessibility, encouraging users to engage with the CTA. The use of contrasting colors ensures visibility, while ample spacing enhances readability.

**Tailwind Notes**:
- Use of bg-gradient for a modern look.
- Rounded corners for a soft, approachable feel.
- Fixed positioning ensures visibility as users scroll.

```html
<section class='fixed bottom-4 right-4 z-50 p-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full shadow-lg'>
  <h2 class='text-white font-bold text-lg mb-2'>Unlock Exclusive Features!</h2>
  <p class='text-white mb-4'>Join our community for early access and special offers.</p>
  <a href='#' class='bg-white text-blue-500 font-semibold py-2 px-6 rounded-full shadow-md hover:bg-gray-100 transition'>Get Started</a>
</section>
```

### Example 2: Floating CTA for Newsletter Signup

**When To Use**: Ideal for encouraging newsletter signups without disrupting the user experience.

**Why It Works**: The sticky nature keeps the CTA accessible at all times, while the contrasting colors and shadows create a visually appealing focal point. The clear typography and ample padding ensure the message is easy to read.

**Tailwind Notes**:
- Contrast between the background and text enhances readability.
- Subtle shadow adds depth, making the CTA stand out.
- Responsive design ensures it looks good on mobile devices.

```html
<section class='fixed bottom-6 left-6 z-50 p-5 bg-white rounded-lg shadow-lg border border-gray-200'>
  <h2 class='text-gray-800 font-semibold text-xl mb-2'>Stay Updated!</h2>
  <p class='text-gray-600 mb-4'>Subscribe to our newsletter for the latest news.</p>
  <form action='#'>
    <input type='email' class='border border-gray-300 rounded-full py-2 px-4 w-full mb-2' placeholder='Enter your email' required>
    <button type='submit' class='bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition'>Subscribe</button>
  </form>
</section>
```

### Example 3: Floating CTA for Limited Time Offer

**When To Use**: Use this design to promote a time-sensitive offer that requires immediate action from users.

**Why It Works**: The vibrant colors and clear typography create a sense of urgency, while the floating nature keeps the offer visible. The use of icons alongside text enhances engagement and understanding.

**Tailwind Notes**:
- Bold colors grab attention and convey urgency.
- Icon usage alongside text improves visual interest.
- Responsive layout ensures usability on all devices.

```html
<section class='fixed bottom-4 left-4 z-50 p-4 bg-red-500 text-white rounded-full shadow-lg flex items-center'>
  <span class='material-icons mr-2'>alarm</span>
  <div>
    <h2 class='font-bold text-lg'>Limited Time Offer!</h2>
    <p>Get 30% off your first purchase.</p>
  </div>
  <a href='#' class='ml-4 bg-white text-red-500 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-100 transition'>Claim Now</a>
</section>
```

## `sticky-cta` / `corner-button`

### Example 1: Promotional Corner Button

**When To Use**: Use this layout for a promotional campaign where you want to highlight a special offer or discount. The corner button draws attention without obstructing the content.

**Why It Works**: The sticky corner button remains visible as users scroll, ensuring that the call to action is always accessible. The contrasting colors and shadow effects create a sense of depth, making the button pop against the background.

**Tailwind Notes**:
- Utilizes fixed positioning for the button to ensure visibility.
- Employs contrasting colors for high visibility.
- Incorporates shadow for depth and emphasis.

```html
<section class='relative min-h-screen bg-gray-100 flex items-center justify-center'>
  <div class='max-w-4xl p-8 text-center'>
    <h1 class='text-4xl font-bold text-gray-800 mb-4'>Unlock Your Special Offer!</h1>
    <p class='text-lg text-gray-600 mb-6'>Sign up today and receive 20% off your first purchase. Don't miss out!</p>
    <button class='bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300'>Get Started</button>
  </div>
  <a href='#' class='fixed bottom-4 right-4 bg-red-600 text-white font-bold py-3 px-5 rounded-full shadow-lg hover:bg-red-700 transition duration-300'>Claim Offer</a>
</section>
```

### Example 2: Event Registration with Corner Button

**When To Use**: Ideal for events or webinars where immediate registration is encouraged. The corner button serves as a quick access point for users.

**Why It Works**: The layout emphasizes the registration details with clear typography and ample spacing, while the sticky button ensures that users can easily register at any time. The use of a bright color for the button contrasts with the softer background, drawing attention.

**Tailwind Notes**:
- Focuses on clear typography to guide users' attention.
- Uses a bright button color for immediate action.
- Includes responsive design considerations for mobile users.

```html
<section class='relative min-h-screen bg-white flex items-center justify-center'>
  <div class='max-w-lg p-6 text-center'>
    <h2 class='text-3xl font-semibold text-gray-900 mb-4'>Join Our Upcoming Webinar!</h2>
    <p class='text-md text-gray-700 mb-4'>Learn from industry experts and enhance your skills.</p>
    <p class='text-lg font-bold text-gray-800 mb-6'>Date: March 15, 2023</p>
    <button class='bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300'>Register Now</button>
  </div>
  <a href='#' class='fixed bottom-4 right-4 bg-orange-500 text-white font-bold py-3 px-5 rounded-full shadow-lg hover:bg-orange-600 transition duration-300'>Sign Up</a>
</section>
```

## `contact` / `form-only`

### Example 1: Simple Contact Form

**When To Use**: Use this example for straightforward contact inquiries where minimal fields are needed.

**Why It Works**: The clean layout and clear hierarchy make it easy for users to understand what information is required, while the prominent CTA encourages submissions.

**Tailwind Notes**:
- Utilizes a flex layout for responsive design.
- Generous padding and margin create breathing space.
- Contrast between background and form elements enhances readability.

```html
<section class="bg-gray-50 p-8 rounded-lg shadow-md max-w-lg mx-auto">
  <h2 class="text-2xl font-bold text-center mb-6">Get in Touch</h2>
  <form>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700" for="name">Name</label>
      <input type="text" id="name" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500" required />
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700" for="email">Email</label>
      <input type="email" id="email" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500" required />
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700" for="message">Message</label>
      <textarea id="message" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500" rows="4" required></textarea>
    </div>
    <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200">Send Message</button>
  </form>
</section>
```

### Example 2: Multi-Column Contact Form

**When To Use**: Ideal for more complex inquiries where additional fields can be grouped in a multi-column layout.

**Why It Works**: The two-column layout allows for more information to be captured without overwhelming the user. The use of clear labels and ample spacing keeps the form user-friendly.

**Tailwind Notes**:
- Grid layout for responsive design on larger screens.
- Consistent spacing and alignment improve usability.
- Emphasized CTA with color and size differentiation.

```html
<section class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
  <h2 class="text-3xl font-bold text-center mb-8">Contact Us</h2>
  <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block text-sm font-medium text-gray-700" for="name">Name</label>
      <input type="text" id="name" class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500" required />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700" for="email">Email</label>
      <input type="email" id="email" class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500" required />
    </div>
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700" for="subject">Subject</label>
      <input type="text" id="subject" class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500" required />
    </div>
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700" for="message">Message</label>
      <textarea id="message" class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500" rows="4" required></textarea>
    </div>
    <button type="submit" class="md:col-span-2 w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-200">Submit</button>
  </form>
</section>
```

## `contact` / `form-with-info`

### Example 1: Contact Us with Info Cards

**When To Use**: Use this layout when you want to provide additional context or information alongside a contact form, like office hours or location details.

**Why It Works**: The use of cards for information creates a clear visual hierarchy, while the form is emphasized with spacing and contrasting colors. This layout encourages users to engage with the form by providing contextual information.

**Tailwind Notes**:
- Cards use shadow and rounded corners for a polished look.
- Responsive grid layout ensures information is accessible on all devices.
- Consistent spacing enhances readability and usability.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Get in Touch</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-8'><div class='bg-white shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Office Hours</h3><p class='text-gray-700'>Mon - Fri: 9 AM - 5 PM<br>Sat: 10 AM - 4 PM<br>Sun: Closed</p></div><div class='bg-white shadow-md rounded-lg p-6'><h3 class='text-xl font-semibold mb-4'>Location</h3><p class='text-gray-700'>123 Main St,<br>City, State, 12345</p></div></div><form class='mt-10 bg-white shadow-md rounded-lg p-8'><h3 class='text-2xl font-bold mb-6'>Contact Form</h3><label class='block mb-2' for='name'>Name</label><input class='w-full p-2 border border-gray-300 rounded mb-4' type='text' id='name' required/><label class='block mb-2' for='email'>Email</label><input class='w-full p-2 border border-gray-300 rounded mb-4' type='email' id='email' required/><label class='block mb-2' for='message'>Message</label><textarea class='w-full p-2 border border-gray-300 rounded mb-4' id='message' rows='4' required></textarea><button class='w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-300' type='submit'>Send Message</button></form></div></div></section>
```

### Example 2: Contact Form with Visual Icons

**When To Use**: Ideal for visually engaging users, this layout incorporates icons next to the contact information to enhance understanding and retention.

**Why It Works**: The inclusion of icons adds a visual element that breaks up text, making the section more engaging. The form is prominent with ample spacing, ensuring that the CTA stands out.

**Tailwind Notes**:
- Icons provide immediate visual cues, improving comprehension.
- Generous padding and margin create a clean, organized appearance.
- Hover effects on the CTA improve interactivity.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto px-4'><h2 class='text-4xl font-bold text-center mb-8'>Contact Us</h2><div class='flex flex-col md:flex-row justify-between items-start'><div class='flex-1 bg-white shadow-lg rounded-lg p-6 mb-6 md:mb-0'><div class='flex items-center mb-4'><svg class='w-6 h-6 text-blue-600 mr-2' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18C5.58 18 2 14.42 2 10S5.58 2 10 2s8 3.58 8 8-3.58 8-8 8z'/></svg><span class='font-semibold'>Office Hours:</span></div><p class='text-gray-700'>Mon - Fri: 9 AM - 5 PM</p></div><div class='flex-1 bg-white shadow-lg rounded-lg p-6 mb-6 md:mb-0'><div class='flex items-center mb-4'><svg class='w-6 h-6 text-blue-600 mr-2' fill='currentColor' viewBox='0 0 20 20'><path d='M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18C5.58 18 2 14.42 2 10S5.58 2 10 2s8 3.58 8 8-3.58 8-8 8z'/></svg><span class='font-semibold'>Location:</span></div><p class='text-gray-700'>123 Main St, City, State, 12345</p></div></div><form class='mt-10 bg-white shadow-lg rounded-lg p-8'><h3 class='text-3xl font-bold mb-6'>Send Us a Message</h3><label class='block mb-2' for='name'>Name</label><input class='w-full p-2 border border-gray-300 rounded mb-4' type='text' id='name' required/><label class='block mb-2' for='email'>Email</label><input class='w-full p-2 border border-gray-300 rounded mb-4' type='email' id='email' required/><label class='block mb-2' for='message'>Message</label><textarea class='w-full p-2 border border-gray-300 rounded mb-4' id='message' rows='4' required></textarea><button class='w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-300' type='submit'>Send</button></form></div></div></section>
```

## `contact` / `booking`

### Example 1: Simple Booking Form

**When To Use**: Use this layout for straightforward booking inquiries where you want users to fill out a form quickly.

**Why It Works**: The clear hierarchy and ample spacing guide the user's eye to the form fields, while the prominent CTA encourages submission. The use of contrasting colors helps the form stand out.

**Tailwind Notes**:
- Utilizes flexbox for layout control.
- Responsive design ensures usability on all devices.
- Focused on accessibility with sufficient color contrast.

```html
<section class='bg-white py-12 px-6 md:px-12'><div class='max-w-lg mx-auto'><h2 class='text-3xl font-semibold text-gray-800 mb-6'>Book Your Appointment</h2><form class='space-y-4'><input type='text' placeholder='Your Name' class='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' required/><input type='email' placeholder='Your Email' class='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' required/><textarea placeholder='Details about your booking' class='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' rows='4' required></textarea><button type='submit' class='w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200'>Submit</button></form></div></section>
```

### Example 2: Booking Options with Cards

**When To Use**: Ideal for showcasing multiple booking options or services, allowing users to choose their preference easily.

**Why It Works**: The card layout visually separates each option, making it easy for users to compare. The use of shadows and hover effects adds depth and interactivity.

**Tailwind Notes**:
- Grid layout for responsive card display.
- Hover effects enhance user engagement.
- Consistent padding and margin create a clean look.

```html
<section class='bg-gray-50 py-12'><div class='max-w-6xl mx-auto px-6'><h2 class='text-3xl font-semibold text-gray-800 mb-8 text-center'>Choose Your Booking</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200'><h3 class='text-xl font-bold text-gray-800 mb-4'>Service A</h3><p class='text-gray-600 mb-4'>Description of Service A.</p><button class='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200'>Book Now</button></div><div class='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200'><h3 class='text-xl font-bold text-gray-800 mb-4'>Service B</h3><p class='text-gray-600 mb-4'>Description of Service B.</p><button class='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200'>Book Now</button></div><div class='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200'><h3 class='text-xl font-bold text-gray-800 mb-4'>Service C</h3><p class='text-gray-600 mb-4'>Description of Service C.</p><button class='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200'>Book Now</button></div></div></div></section>
```

### Example 3: Contact and Booking Information

**When To Use**: Use this layout for a more detailed booking section that includes contact information alongside the booking form.

**Why It Works**: Combining contact details with a booking form provides users with multiple ways to reach out, enhancing user experience. The layout is organized to prevent clutter, ensuring clarity.

**Tailwind Notes**:
- Flexbox for side-by-side layout on larger screens.
- Responsive adjustments for mobile view.
- Clear typography and spacing for readability.

```html
<section class='bg-white py-12'><div class='max-w-6xl mx-auto px-6'><h2 class='text-3xl font-semibold text-gray-800 mb-6 text-center'>Get in Touch and Book</h2><div class='flex flex-col md:flex-row md:space-x-8'><div class='w-full md:w-1/2'><h3 class='text-xl font-semibold text-gray-800 mb-4'>Contact Us</h3><p class='text-gray-600 mb-4'>Phone: (123) 456-7890</p><p class='text-gray-600 mb-4'>Email: contact@example.com</p><p class='text-gray-600'>Feel free to reach out for any inquiries.</p></div><div class='w-full md:w-1/2'><form class='space-y-4'><input type='text' placeholder='Your Name' class='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' required/><input type='email' placeholder='Your Email' class='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' required/><textarea placeholder='Booking Details' class='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' rows='4' required></textarea><button type='submit' class='w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200'>Submit</button></form></div></div></div></section>
```

## `contact` / `scheduler`

### Example 1: Simple Scheduler Form

**When To Use**: Use this layout when you want to provide a straightforward scheduling option with minimal distractions.

**Why It Works**: The clean layout and ample spacing guide the user's attention to the form, while the contrasting button ensures the CTA stands out.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Clear typography hierarchy enhances readability.
- Ample padding and margin create a spacious feel.

```html
<section class='bg-white py-16 px-4 sm:px-6 lg:px-8'><div class='max-w-md mx-auto'><h2 class='text-3xl font-semibold text-center mb-6'>Schedule a Call</h2><p class='text-gray-600 text-center mb-8'>Choose a convenient time for us to connect.</p><form class='bg-gray-100 p-6 rounded-lg shadow-md'><div class='mb-4'><label class='block text-sm font-medium text-gray-700' for='name'>Your Name</label><input class='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200' type='text' id='name' required /></div><div class='mb-4'><label class='block text-sm font-medium text-gray-700' for='email'>Your Email</label><input class='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200' type='email' id='email' required /></div><div class='mb-4'><label class='block text-sm font-medium text-gray-700' for='date'>Select Date</label><input class='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200' type='date' id='date' required /></div><div class='mb-4'><label class='block text-sm font-medium text-gray-700' for='time'>Select Time</label><input class='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200' type='time' id='time' required /></div><button class='w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200'>Schedule Now</button></form></div></section>
```

### Example 2: Detailed Scheduler with Service Options

**When To Use**: Ideal for businesses offering multiple services or consultation types, allowing users to select their preference.

**Why It Works**: The card layout organizes service options neatly, making it easy for users to understand their choices while keeping the form accessible.

**Tailwind Notes**:
- Grid layout for service options enhances visual hierarchy.
- Hover effects on cards improve interactivity.
- Responsive design ensures usability on all devices.

```html
<section class='bg-gray-50 py-16 px-4 sm:px-6 lg:px-8'><div class='max-w-6xl mx-auto'><h2 class='text-3xl font-semibold text-center mb-6'>Choose Your Service</h2><p class='text-gray-600 text-center mb-8'>Select a service to schedule your appointment.</p><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200'><h3 class='text-lg font-semibold mb-2'>Consultation</h3><p class='text-gray-600 mb-4'>One-on-one consultation to discuss your needs.</p><button class='bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 w-full'>Select</button></div><div class='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200'><h3 class='text-lg font-semibold mb-2'>Product Demo</h3><p class='text-gray-600 mb-4'>A live demo of our product features.</p><button class='bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 w-full'>Select</button></div><div class='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200'><h3 class='text-lg font-semibold mb-2'>Follow-up Call</h3><p class='text-gray-600 mb-4'>Discuss progress and next steps.</p><button class='bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 w-full'>Select</button></div></div><form class='mt-8 bg-white p-6 rounded-lg shadow-md'><h3 class='text-xl font-semibold mb-4'>Schedule Your Appointment</h3><div class='mb-4'><label class='block text-sm font-medium text-gray-700' for='name'>Your Name</label><input class='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200' type='text' id='name' required /></div><div class='mb-4'><label class='block text-sm font-medium text-gray-700' for='email'>Your Email</label><input class='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200' type='email' id='email' required /></div><div class='mb-4'><label class='block text-sm font-medium text-gray-700' for='date'>Select Date</label><input class='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200' type='date' id='date' required /></div><div class='mb-4'><label class='block text-sm font-medium text-gray-700' for='time'>Select Time</label><input class='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200' type='time' id='time' required /></div><button class='w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200'>Schedule Now</button></form></div></section>
```

## `contact` / `map-contact`

### Example 1: Contact Us with Map Integration

**When To Use**: Use this layout to provide users with a clear way to contact your business while showcasing your location on a map.

**Why It Works**: This example combines a visually appealing map with contact details, creating a seamless experience for users. The layout is responsive, ensuring usability on all devices.

**Tailwind Notes**:
- Flexbox is used for responsive layout.
- Padding and margin utilities create intentional spacing.
- Contrast between text and background enhances readability.
- CTA button is styled to stand out and encourage action.

```html
<section class='bg-white p-8 md:flex md:justify-between md:items-center'>
  <div class='md:w-1/2 mb-6 md:mb-0'>
    <h2 class='text-2xl font-semibold mb-4'>Get in Touch</h2>
    <p class='text-gray-700 mb-2'>123 Main Street,<br>Cityville, ST 12345</p>
    <p class='text-gray-700 mb-4'>Email: contact@business.com<br>Phone: (123) 456-7890</p>
    <a href='mailto:contact@business.com' class='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition'>Email Us</a>
  </div>
  <div class='md:w-1/2'>
    <iframe class='w-full h-64 rounded-lg shadow-md' src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509169!2d144.95373531531868!3d-37.81627997975157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f1d4c61%3A0x5045675218cd4e0!2sBusiness%20Location!5e0!3m2!1sen!2sus!4v1616161616161!5m2!1sen!2sus' allowfullscreen='' loading='lazy'></iframe>
  </div>
</section>
```

### Example 2: Contact Information with Interactive Map

**When To Use**: Ideal for businesses that want to emphasize their location while providing essential contact details.

**Why It Works**: The layout is structured to draw attention to both the map and the contact information. The use of color and spacing creates a balanced look.

**Tailwind Notes**:
- Grid layout for better alignment of elements.
- Use of rounded corners and shadows for a modern aesthetic.
- Hover effects on buttons enhance interactivity.
- Responsive design ensures accessibility on mobile devices.

```html
<section class='bg-gray-100 p-6 md:p-12'>
  <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
    <div class='bg-white p-6 rounded-lg shadow-lg'>
      <h2 class='text-xl font-bold mb-4'>Contact Us</h2>
      <p class='text-gray-600 mb-2'>123 Elm Street,<br>Townsville, ST 67890</p>
      <p class='text-gray-600 mb-4'>Email: info@business.com<br>Phone: (987) 654-3210</p>
      <a href='mailto:info@business.com' class='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition'>Get in Touch</a>
    </div>
    <div>
      <iframe class='w-full h-64 rounded-lg' src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509169!2d144.95373531531868!3d-37.81627997975157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f1d4c61%3A0x5045675218cd4e0!2sBusiness%20Location!5e0!3m2!1sen!2sus!4v1616161616161!5m2!1sen!2sus' allowfullscreen='' loading='lazy'></iframe>
    </div>
  </div>
</section>
```

## `contact` / `chat-first`

### Example 1: Live Chat Invitation

**When To Use**: When you want to encourage users to engage with customer support through a chat interface.

**Why It Works**: The layout emphasizes the chat feature with a clear call to action, inviting users to start a conversation. The use of contrasting colors and ample spacing creates a visually appealing and approachable design.

**Tailwind Notes**:
- Uses rounded corners and shadow for a modern card effect.
- High contrast colors for CTA to grab attention.
- Responsive design ensures usability on all devices.

```html
<section class='bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto text-center'>
  <h2 class='text-2xl font-semibold mb-4'>Need Help? Chat with Us!</h2>
  <p class='text-gray-600 mb-6'>Our support team is here to assist you 24/7. Click the button below to start a chat.</p>
  <a href='#' class='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200'>Start Chat</a>
</section>
```

### Example 2: Chat Support with FAQs

**When To Use**: When you want to provide users with quick answers alongside chat support, enhancing their experience.

**Why It Works**: This layout combines a chat invitation with a list of frequently asked questions. The clear separation and hierarchy make it easy for users to navigate between options, while the chat button remains prominently featured.

**Tailwind Notes**:
- Flexbox layout for responsive design.
- Consistent spacing and typography for readability.
- FAQs are visually distinct with hover effects for interactivity.

```html
<section class='bg-gray-100 p-10 rounded-lg max-w-4xl mx-auto'>
  <h2 class='text-3xl font-bold mb-6 text-center'>Chat with Us or Check Our FAQs</h2>
  <div class='flex flex-col md:flex-row justify-between mb-8'>
    <div class='flex-1 bg-white p-6 rounded-lg shadow-md mr-0 md:mr-4'>
      <h3 class='text-xl font-semibold mb-2'>Need Immediate Assistance?</h3>
      <p class='text-gray-700 mb-4'>Chat with our support team now.</p>
      <a href='#' class='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200'>Start Chat</a>
    </div>
    <div class='flex-1 bg-white p-6 rounded-lg shadow-md'>
      <h3 class='text-xl font-semibold mb-2'>Frequently Asked Questions</h3>
      <ul class='space-y-2'>
        <li><a href='#' class='text-blue-600 hover:underline'>What are your hours of operation?</a></li>
        <li><a href='#' class='text-blue-600 hover:underline'>How can I track my order?</a></li>
        <li><a href='#' class='text-blue-600 hover:underline'>What is your return policy?</a></li>
      </ul>
    </div>
  </div>
</section>
```

### Example 3: Chat-First Contact Section with Testimonials

**When To Use**: When you want to build trust and encourage chat engagement by showcasing customer testimonials.

**Why It Works**: This design combines social proof with a chat invitation, making the chat option more appealing. Testimonials add credibility, while the layout keeps the focus on the chat feature.

**Tailwind Notes**:
- Grid layout for responsive testimonials.
- Use of background and border colors to differentiate sections.
- Testimonial cards use shadow for depth and emphasis.

```html
<section class='bg-white p-10 rounded-lg shadow-lg max-w-6xl mx-auto'>
  <h2 class='text-3xl font-bold mb-6 text-center'>Join Our Happy Customers!</h2>
  <div class='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
    <div class='bg-gray-50 p-4 rounded-lg shadow-md'>
      <p class='text-gray-700 italic'>“Fantastic service! I got my answers quickly.”</p>
      <p class='text-right font-semibold'>- Alex J.</p>
    </div>
    <div class='bg-gray-50 p-4 rounded-lg shadow-md'>
      <p class='text-gray-700 italic'>“The support team was super helpful!”</p>
      <p class='text-right font-semibold'>- Jamie L.</p>
    </div>
    <div class='bg-gray-50 p-4 rounded-lg shadow-md'>
      <p class='text-gray-700 italic'>“I love the chat feature, it's so convenient!”</p>
      <p class='text-right font-semibold'>- Morgan T.</p>
    </div>
  </div>
  <div class='text-center'>
    <p class='text-gray-600 mb-4'>Have questions? We’re here to help!</p>
    <a href='#' class='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200'>Start Chat</a>
  </div>
</section>
```

## `newsletter` / `inline`

### Example 1: Minimalist Inline Newsletter Sign-Up

**When To Use**: When you want to keep the design clean and focus on the sign-up process without distractions.

**Why It Works**: The use of a simple layout, ample white space, and a prominent call-to-action button ensures the user’s attention is directed towards signing up, while the minimalist design maintains a polished and professional appearance.

**Tailwind Notes**:
- Utilizes flexbox for alignment and spacing.
- Emphasizes the CTA with a contrasting button color.
- Responsive adjustments ensure usability on all devices.

```html
<section class='flex items-center justify-center p-6 bg-gray-100 rounded-lg'>
  <h2 class='text-xl font-semibold text-gray-800 mr-4'>Join our Newsletter</h2>
  <input type='email' placeholder='Your email address' class='border border-gray-300 rounded-lg p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
  <button class='bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200'>Subscribe</button>
</section>
```

### Example 2: Bold Inline Newsletter with Illustration

**When To Use**: Ideal for visually engaging landing pages where you want to combine imagery with the newsletter sign-up.

**Why It Works**: The combination of an illustration and a vibrant color palette draws attention, while the clear hierarchy in typography and button styling enhances usability and encourages sign-ups.

**Tailwind Notes**:
- Uses a flex layout to position the illustration and text side-by-side.
- Contrast in colors creates visual interest and guides the user’s eye.
- Responsive design ensures the layout stacks vertically on smaller screens.

```html
<section class='flex items-center p-6 bg-white shadow-md rounded-lg'>
  <img src='illustration.png' alt='Newsletter Illustration' class='w-1/3 h-auto mr-4' />
  <div class='flex flex-col'>
    <h2 class='text-2xl font-bold text-gray-900 mb-2'>Stay Updated!</h2>
    <p class='text-gray-600 mb-4'>Subscribe to our newsletter for the latest news and offers.</p>
    <div class='flex'>
      <input type='email' placeholder='Your email' class='border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
      <button class='bg-green-500 text-white font-bold py-2 px-4 rounded-r-lg hover:bg-green-600 transition duration-200'>Subscribe</button>
    </div>
  </div>
</section>
```

### Example 3: Compact Inline Newsletter for Mobile Optimization

**When To Use**: Best for mobile-first designs where space is limited but you still want to capture email sign-ups effectively.

**Why It Works**: The compact design maximizes the use of limited screen space while maintaining clarity and ease of interaction. The CTA button is large enough for easy tapping, and the input field is user-friendly.

**Tailwind Notes**:
- Stacked layout on mobile with flexbox for horizontal alignment on larger screens.
- Generous padding and margin ensure touch targets are accessible.
- Color contrast ensures readability and visibility.

```html
<section class='flex flex-col sm:flex-row items-center p-4 bg-gray-200 rounded-lg'>
  <h2 class='text-lg font-semibold text-gray-800 mb-2 sm:mb-0 sm:mr-4'>Subscribe Now!</h2>
  <div class='flex w-full'>
    <input type='email' placeholder='Enter your email' class='border border-gray-400 rounded-l-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500' />
    <button class='bg-purple-600 text-white font-bold py-2 px-4 rounded-r-lg hover:bg-purple-700 transition duration-200'>Join</button>
  </div>
</section>
```

## `newsletter` / `box`

### Example 1: Simple Newsletter Signup

**When To Use**: Use this layout for a straightforward newsletter signup that emphasizes clarity and ease of use.

**Why It Works**: The use of contrasting colors for the background and button enhances visibility, while ample padding and margin create a clean, organized appearance. The typography hierarchy draws attention to the heading and CTA.

**Tailwind Notes**:
- bg-gray-100 for a soft background that doesn't distract from the content.
- text-center for a balanced layout.
- rounded-lg and shadow-lg to give the box a polished, elevated look.
- focus:outline-none and hover:bg-blue-600 for interactive button states.

```html
<section class='bg-gray-100 p-8 rounded-lg shadow-lg text-center'>
  <h2 class='text-2xl font-bold mb-4'>Stay Updated!</h2>
  <p class='text-gray-600 mb-6'>Subscribe to our newsletter for the latest news and exclusive offers.</p>
  <form class='flex justify-center'>
    <input type='email' placeholder='Your email address' class='border border-gray-300 rounded-l-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500' required />
    <button type='submit' class='bg-blue-500 text-white rounded-r-lg p-2 hover:bg-blue-600 focus:outline-none'>Subscribe</button>
  </form>
</section>
```

### Example 2: Promotional Newsletter Box

**When To Use**: Ideal for marketing campaigns where you want to highlight a special offer or promotion.

**Why It Works**: The bold colors and large typography create a sense of urgency and excitement. The CTA button is prominent and encourages immediate action, while the background and text colors maintain good contrast for readability.

**Tailwind Notes**:
- bg-gradient-to-r from-blue-500 to-purple-600 for an eye-catching background.
- text-white for high contrast against the background.
- p-10 for generous spacing that makes the content feel less cramped.
- transition duration-300 for smooth button hover effects.

```html
<section class='bg-gradient-to-r from-blue-500 to-purple-600 p-10 text-white text-center rounded-lg shadow-lg'>
  <h2 class='text-3xl font-extrabold mb-4'>Exclusive Offer Just for You!</h2>
  <p class='mb-6'>Sign up today and get 20% off your first purchase.</p>
  <form class='flex justify-center'>
    <input type='email' placeholder='Your email address' class='border border-white rounded-l-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-white' required />
    <button type='submit' class='bg-white text-blue-500 rounded-r-lg p-2 hover:bg-gray-200 transition duration-300'>Get Offer</button>
  </form>
</section>
```

### Example 3: Newsletter with Image Background

**When To Use**: Best for visually engaging newsletters where imagery enhances the message.

**Why It Works**: The use of a background image adds visual interest and context. The overlay and contrasting text ensure readability while still allowing the image to shine. The CTA is clear and inviting.

**Tailwind Notes**:
- bg-cover bg-center h-64 for a full-height background image that grabs attention.
- bg-black bg-opacity-50 for a dark overlay that improves text legibility.
- text-lg for a larger, more inviting font size.
- rounded-lg and p-6 for a polished container that feels cohesive.

```html
<section class='bg-cover bg-center h-64 relative' style='background-image: url(https://example.com/image.jpg);'>
  <div class='bg-black bg-opacity-50 h-full flex items-center justify-center rounded-lg p-6'>
    <div class='text-white text-center'>
      <h2 class='text-3xl font-bold mb-2'>Join Our Community!</h2>
      <p class='mb-4'>Subscribe for updates and special content.</p>
      <form class='flex justify-center'>
        <input type='email' placeholder='Your email address' class='border border-white rounded-l-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500' required />
        <button type='submit' class='bg-blue-500 text-white rounded-r-lg p-2 hover:bg-blue-600 focus:outline-none'>Subscribe</button>
      </form>
    </div>
  </div>
</section>
```

## `newsletter` / `split`

### Example 1: Split Newsletter Section with Image

**When To Use**: When you want to visually engage users with an image while prompting them to subscribe to your newsletter.

**Why It Works**: The use of a split layout creates a clear visual hierarchy, drawing attention to the CTA while the image enhances the overall aesthetic. The contrasting colors and ample spacing ensure that the section is both inviting and easy to read.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs contrasting background and text colors for emphasis.
- Generous padding and margin create a clean look.

```html
<section class='flex flex-col md:flex-row items-center bg-gray-100 p-8 md:p-16'><div class='md:w-1/2'><h2 class='text-3xl font-bold mb-4'>Stay Updated!</h2><p class='text-gray-700 mb-6'>Subscribe to our newsletter for the latest news and updates.</p><button class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300'>Subscribe Now</button></div><div class='md:w-1/2'><img src='newsletter-image.jpg' alt='Newsletter' class='w-full h-auto rounded-lg shadow-lg'/></div></section>
```

### Example 2: Split Newsletter Section with Cards

**When To Use**: When you want to showcase multiple subscription options or benefits in a visually appealing format.

**Why It Works**: The card layout allows for organized presentation of information, making it easy for users to digest. The split design emphasizes the CTA while still providing detailed content, enhancing user engagement.

**Tailwind Notes**:
- Cards are responsive and stack on smaller screens.
- Consistent spacing and alignment create a polished look.
- Hover effects on cards improve interactivity.

```html
<section class='flex flex-col md:flex-row items-center bg-white p-8 md:p-16'><div class='md:w-1/2'><h2 class='text-3xl font-bold mb-4'>Join Our Community!</h2><p class='text-gray-700 mb-6'>Choose a subscription plan that fits you.</p><div class='grid grid-cols-1 md:grid-cols-2 gap-4'><div class='border rounded-lg p-4 shadow-lg hover:shadow-xl transition duration-300'><h3 class='font-semibold text-lg'>Monthly Plan</h3><p class='text-gray-600'>Get updates every month.</p><button class='mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Subscribe</button></div><div class='border rounded-lg p-4 shadow-lg hover:shadow-xl transition duration-300'><h3 class='font-semibold text-lg'>Yearly Plan</h3><p class='text-gray-600'>Save 20% with annual subscription.</p><button class='mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Subscribe</button></div></div></div><div class='md:w-1/2'><img src='newsletter-cards.jpg' alt='Newsletter Cards' class='w-full h-auto rounded-lg shadow-lg'/></div></section>
```

## `about-team` / `story`

### Example 1: Team Story Highlights

**When To Use**: Use this layout to showcase key stories or achievements of team members, emphasizing their contributions and experiences.

**Why It Works**: This design effectively utilizes spacing, typography, and contrasting colors to create a visually appealing and easy-to-read section. The use of cards allows for a structured presentation of individual stories, making it easy for users to digest information.

**Tailwind Notes**:
- Grid layout for responsive design and clear hierarchy.
- Use of shadow and rounded corners for card styling enhances visual appeal.
- Strong emphasis on CTAs to encourage user engagement.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Our Team's Stories</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-white rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold mb-4'>John Doe</h3><p class='text-gray-700 mb-4'>John has been with us for over 5 years, leading innovative projects that push boundaries.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Read More</a></div><div class='bg-white rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold mb-4'>Jane Smith</h3><p class='text-gray-700 mb-4'>Jane's creativity and vision have transformed our marketing strategies.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Read More</a></div><div class='bg-white rounded-lg shadow-lg p-6'><h3 class='text-xl font-semibold mb-4'>Emily Johnson</h3><p class='text-gray-700 mb-4'>Emily's leadership skills have helped our team achieve new heights.</p><a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'>Read More</a></div></div></div></section>
```

### Example 2: Team Member Spotlights

**When To Use**: Ideal for highlighting individual team members and their unique stories, fostering a personal connection with the audience.

**Why It Works**: The layout uses a flexbox approach for better alignment and distribution of space. The use of background colors and borders helps to differentiate each story, while the responsive design ensures accessibility across devices.

**Tailwind Notes**:
- Flexbox for alignment and responsiveness.
- Use of contrasting background colors for visual separation.
- Incorporation of icons or images can enhance storytelling.

```html
<section class='py-16 bg-white'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Meet Our Team</h2><div class='flex flex-col md:flex-row md:space-x-8'><div class='bg-gray-100 border border-gray-300 rounded-lg p-6 mb-6 md:mb-0'><h3 class='text-xl font-semibold mb-2'>Michael Brown</h3><p class='text-gray-600'>Michael is passionate about technology and innovation.</p><a href='#' class='mt-4 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition'>Discover More</a></div><div class='bg-gray-100 border border-gray-300 rounded-lg p-6 mb-6 md:mb-0'><h3 class='text-xl font-semibold mb-2'>Sarah Wilson</h3><p class='text-gray-600'>Sarah brings a wealth of experience in project management.</p><a href='#' class='mt-4 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition'>Discover More</a></div><div class='bg-gray-100 border border-gray-300 rounded-lg p-6'><h3 class='text-xl font-semibold mb-2'>David Lee</h3><p class='text-gray-600'>David's expertise in design drives our creative vision.</p><a href='#' class='mt-4 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition'>Discover More</a></div></div></div></section>
```

## `about-team` / `team-grid`

### Example 1: Team Member Showcase

**When To Use**: Use this layout to highlight individual team members with a focus on their roles and contributions, ideal for tech companies or agencies.

**Why It Works**: The grid layout creates a clean, organized presentation of team members, while the use of cards allows for a visually distinct separation of each member. The hover effect adds interactivity, encouraging user engagement.

**Tailwind Notes**:
- Grid layout ensures responsiveness and optimal use of space.
- Hover effects improve user interaction.
- Consistent card styling maintains visual harmony.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Meet Our Team</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white rounded-lg shadow-lg overflow-hidden'><img class='w-full h-48 object-cover' src='team-member-1.jpg' alt='Team Member 1'><div class='p-6'><h3 class='text-xl font-semibold'>Alice Johnson</h3><p class='text-gray-600'>Lead Developer</p><p class='mt-4 text-gray-700'>Alice has over 10 years of experience in software development and leads our engineering team.</p><a href='#' class='mt-4 inline-block text-blue-500 hover:text-blue-700 font-semibold'>View Profile</a></div></div><div class='bg-white rounded-lg shadow-lg overflow-hidden'><img class='w-full h-48 object-cover' src='team-member-2.jpg' alt='Team Member 2'><div class='p-6'><h3 class='text-xl font-semibold'>Bob Smith</h3><p class='text-gray-600'>Project Manager</p><p class='mt-4 text-gray-700'>Bob ensures that all projects are delivered on time and within budget.</p><a href='#' class='mt-4 inline-block text-blue-500 hover:text-blue-700 font-semibold'>View Profile</a></div></div><div class='bg-white rounded-lg shadow-lg overflow-hidden'><img class='w-full h-48 object-cover' src='team-member-3.jpg' alt='Team Member 3'><div class='p-6'><h3 class='text-xl font-semibold'>Charlie Brown</h3><p class='text-gray-600'>UX/UI Designer</p><p class='mt-4 text-gray-700'>Charlie is passionate about creating user-friendly designs that enhance the user experience.</p><a href='#' class='mt-4 inline-block text-blue-500 hover:text-blue-700 font-semibold'>View Profile</a></div></div></div></div></section>
```

### Example 2: Diverse Team Highlights

**When To Use**: This layout is suitable for organizations that want to emphasize team diversity and individual strengths, perfect for non-profits or community-focused organizations.

**Why It Works**: The use of varied background colors for each card creates visual interest and highlights each member's unique contributions. The clear typography and emphasis on roles enhance readability and professionalism.

**Tailwind Notes**:
- Color variation in cards adds visual dynamism.
- Clear typography hierarchy improves legibility.
- Responsive design ensures accessibility on all devices.

```html
<section class='py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Diverse Team</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-blue-100 rounded-lg shadow-lg overflow-hidden'><img class='w-full h-48 object-cover' src='team-member-4.jpg' alt='Team Member 4'><div class='p-6'><h3 class='text-xl font-semibold'>Dana White</h3><p class='text-gray-600'>Community Outreach</p><p class='mt-4 text-gray-700'>Dana works tirelessly to connect our organization with the local community.</p><a href='#' class='mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold'>Learn More</a></div></div><div class='bg-green-100 rounded-lg shadow-lg overflow-hidden'><img class='w-full h-48 object-cover' src='team-member-5.jpg' alt='Team Member 5'><div class='p-6'><h3 class='text-xl font-semibold'>Eli Green</h3><p class='text-gray-600'>Financial Advisor</p><p class='mt-4 text-gray-700'>Eli provides essential financial guidance to our clients.</p><a href='#' class='mt-4 inline-block text-green-600 hover:text-green-800 font-semibold'>Learn More</a></div></div><div class='bg-yellow-100 rounded-lg shadow-lg overflow-hidden'><img class='w-full h-48 object-cover' src='team-member-6.jpg' alt='Team Member 6'><div class='p-6'><h3 class='text-xl font-semibold'>Fiona Lee</h3><p class='text-gray-600'>Marketing Specialist</p><p class='mt-4 text-gray-700'>Fiona develops marketing strategies that resonate with our audience.</p><a href='#' class='mt-4 inline-block text-yellow-600 hover:text-yellow-800 font-semibold'>Learn More</a></div></div></div></div></section>
```

## `about-team` / `values`

### Example 1: Core Values with Icons

**When To Use**: Use this layout to highlight your team's core values with accompanying icons for a visually engaging presentation.

**Why It Works**: The use of icons paired with text creates a clear visual hierarchy, making it easy for users to scan and understand the values. The grid layout ensures responsiveness and maintains a clean, organized look.

**Tailwind Notes**:
- Flexbox grid for responsive layout
- Consistent spacing for visual balance
- Hover effects on cards for interactivity

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Our Core Values</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'><div class='flex items-center justify-center mb-4'><img src='icon1.svg' alt='Value 1' class='w-12 h-12'/></div><h3 class='text-xl font-semibold mb-2'>Integrity</h3><p class='text-gray-600'>We uphold the highest standards of integrity in all of our actions.</p></div><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'><div class='flex items-center justify-center mb-4'><img src='icon2.svg' alt='Value 2' class='w-12 h-12'/></div><h3 class='text-xl font-semibold mb-2'>Innovation</h3><p class='text-gray-600'>We strive to innovate and improve our services continuously.</p></div><div class='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow'><div class='flex items-center justify-center mb-4'><img src='icon3.svg' alt='Value 3' class='w-12 h-12'/></div><h3 class='text-xl font-semibold mb-2'>Teamwork</h3><p class='text-gray-600'>We work together, across boundaries, to meet the needs of our customers.</p></div></div></div></section>
```

### Example 2: Values with Background Highlight

**When To Use**: Ideal for a more visually striking presentation of values, this layout employs a background color to emphasize the section.

**Why It Works**: The contrasting background color draws attention to the section, while the centered text and cards create a strong focal point. This layout also enhances readability and engagement.

**Tailwind Notes**:
- Background color for emphasis
- Center-aligned text for strong focus
- Responsive card layout for flexibility

```html
<section class='py-16 bg-blue-900'><div class='container mx-auto px-4'><h2 class='text-4xl font-bold text-white text-center mb-8'>Our Values</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'><div class='bg-white shadow-md rounded-lg p-5'><h3 class='text-xl font-semibold mb-2'>Customer Focus</h3><p class='text-gray-700'>We prioritize our customers’ needs and work to exceed their expectations.</p></div><div class='bg-white shadow-md rounded-lg p-5'><h3 class='text-xl font-semibold mb-2'>Sustainability</h3><p class='text-gray-700'>We are committed to sustainable practices that benefit the environment.</p></div><div class='bg-white shadow-md rounded-lg p-5'><h3 class='text-xl font-semibold mb-2'>Excellence</h3><p class='text-gray-700'>We strive for excellence in everything we do.</p></div><div class='bg-white shadow-md rounded-lg p-5'><h3 class='text-xl font-semibold mb-2'>Diversity</h3><p class='text-gray-700'>We embrace diversity and inclusivity in our workplace.</p></div></div></div></section>
```

## `about-team` / `founder-led`

### Example 1: Founder Spotlight with Bio

**When To Use**: Use this layout to highlight the founder with a detailed bio, showcasing their experience and vision.

**Why It Works**: The combination of large imagery, bold typography, and ample white space creates a polished and professional look. The clear hierarchy guides the user's attention to important information.

**Tailwind Notes**:
- Flexbox for layout alignment.
- Responsive grid for image and text.
- Contrast between text and background for readability.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Meet Our Founder</h2><div class='flex flex-col md:flex-row items-center justify-center'><img src='founder.jpg' alt='Founder Image' class='w-48 h-48 rounded-full shadow-lg mb-6 md:mb-0 md:mr-8'><div class='text-center md:text-left'><h3 class='text-2xl font-semibold'>Jane Doe</h3><p class='text-gray-700 mb-4'>Jane is a visionary leader with over 20 years of experience in the tech industry. Her passion for innovation drives our mission forward.</p><a href='#' class='inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a></div></div></div></section>
```

### Example 2: Founders Gallery with Quotes

**When To Use**: Ideal for showcasing multiple founders with quotes, emphasizing their contributions and philosophies.

**Why It Works**: The grid layout allows for a visually appealing arrangement of founder images and quotes. The use of cards adds depth and interactivity, while maintaining a cohesive look.

**Tailwind Notes**:
- Grid layout for responsive design.
- Card styling for each founder's section.
- Hover effects to enhance interactivity.

```html
<section class='py-12 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Founders</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-gray-100 p-6 rounded-lg shadow-lg'><img src='founder1.jpg' alt='Founder 1' class='w-32 h-32 rounded-full mx-auto mb-4'><h3 class='text-xl font-semibold text-center'>John Smith</h3><p class='text-gray-600 italic text-center'>“Innovation is at the heart of everything we do.”</p></div><div class='bg-gray-100 p-6 rounded-lg shadow-lg'><img src='founder2.jpg' alt='Founder 2' class='w-32 h-32 rounded-full mx-auto mb-4'><h3 class='text-xl font-semibold text-center'>Emily Johnson</h3><p class='text-gray-600 italic text-center'>“Empowering teams to succeed is my mission.”</p></div><div class='bg-gray-100 p-6 rounded-lg shadow-lg'><img src='founder3.jpg' alt='Founder 3' class='w-32 h-32 rounded-full mx-auto mb-4'><h3 class='text-xl font-semibold text-center'>Michael Lee</h3><p class='text-gray-600 italic text-center'>“Customer satisfaction is our top priority.”</p></div></div></div></section>
```

## `about-team` / `culture-led`

### Example 1: Team Culture Highlights

**When To Use**: Use this layout to showcase key aspects of your team culture, emphasizing values and team activities.

**Why It Works**: The grid layout allows for a clean presentation of multiple culture highlights, while the use of contrasting colors and typography draws attention to each item.

**Tailwind Notes**:
- Flexbox for responsive grid layout.
- Consistent spacing ensures a polished look.
- Use of hover effects to enhance interactivity.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Team Culture</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Collaboration</h3><p class='text-gray-600'>We believe in working together to achieve great results.</p></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Innovation</h3><p class='text-gray-600'>Constantly pushing the boundaries of what's possible.</p></div><div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'><h3 class='text-xl font-semibold mb-4'>Inclusivity</h3><p class='text-gray-600'>Creating a welcoming environment for everyone.</p></div></div></div></section>
```

### Example 2: Our Values in Action

**When To Use**: Ideal for highlighting specific team values through real-life examples or testimonials.

**Why It Works**: The use of cards with images and text creates an engaging visual narrative, while the thoughtful spacing and typography enhance readability.

**Tailwind Notes**:
- Use of images to add visual interest.
- Text alignment and sizing for hierarchy.
- Responsive design ensures accessibility on all devices.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-10'>Our Values in Action</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-gray-100 rounded-lg overflow-hidden shadow-md'><img src='team-collaboration.jpg' alt='Team Collaboration' class='w-full h-48 object-cover'><div class='p-4'><h3 class='text-lg font-semibold'>Team Collaboration</h3><p class='text-gray-700'>Working together to achieve the best results.</p></div></div><div class='bg-gray-100 rounded-lg overflow-hidden shadow-md'><img src='innovation.jpg' alt='Innovation' class='w-full h-48 object-cover'><div class='p-4'><h3 class='text-lg font-semibold'>Innovation</h3><p class='text-gray-700'>Fostering creativity and new ideas.</p></div></div><div class='bg-gray-100 rounded-lg overflow-hidden shadow-md'><img src='inclusivity.jpg' alt='Inclusivity' class='w-full h-48 object-cover'><div class='p-4'><h3 class='text-lg font-semibold'>Inclusivity</h3><p class='text-gray-700'>Embracing diverse perspectives.</p></div></div></div></div></section>
```

## `founder-note` / `letter`

### Example 1: Personalized Founder Letter with Image

**When To Use**: Use this layout when you want to create a warm, inviting introduction from the founder, accompanied by a personal image.

**Why It Works**: The combination of a personal image and a heartfelt message creates a connection with the audience. The use of space and typography enhances readability and draws attention to the message.

**Tailwind Notes**:
- The 'max-w-2xl' class keeps the content centered and readable on larger screens.
- Using 'mb-6' for spacing between the image and the text creates a clear visual hierarchy.

```html
<section class='bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto'>
  <img src='founder.jpg' alt='Founder Image' class='w-32 h-32 rounded-full mx-auto mb-6'>
  <h2 class='text-2xl font-bold text-center mb-4'>A Note from Our Founder</h2>
  <p class='text-gray-700 mb-6'>Dear valued customers, thank you for being part of our journey. Your support inspires us to innovate and improve every day.</p>
  <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Join Us</a>
</section>
```

### Example 2: Founder Letter with Background and Quote

**When To Use**: Ideal for emphasizing a key message from the founder, this layout utilizes a background and a highlighted quote.

**Why It Works**: The background color adds visual interest, while the quote styling draws attention to the most important part of the message. The layout is responsive and maintains a professional look across devices.

**Tailwind Notes**:
- Using 'bg-gray-100' creates a subtle contrast that enhances readability.
- The 'quote' class with 'text-xl italic' makes the founder's words stand out.

```html
<section class='bg-gray-100 p-8 rounded-lg shadow-md max-w-3xl mx-auto'>
  <h2 class='text-3xl font-bold text-center mb-4'>A Message from Our Founder</h2>
  <blockquote class='border-l-4 border-blue-600 pl-4 italic text-lg text-gray-600 mb-6'>
    "Innovation is the key to our future. Together, we can achieve greatness."
  </blockquote>
  <p class='text-gray-700 mb-6'>Thank you for believing in our vision. Your trust drives us to push boundaries.</p>
  <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a>
</section>
```

### Example 3: Founder Letter with Testimonials

**When To Use**: This layout is effective when you want to combine the founder's message with customer testimonials, creating a sense of community.

**Why It Works**: Integrating testimonials provides social proof and reinforces the founder's message. The grid layout is visually appealing and keeps the content organized.

**Tailwind Notes**:
- Using 'grid grid-cols-1 md:grid-cols-2 gap-6' allows for a responsive layout that adapts to different screen sizes.
- The 'p-4' on testimonial cards ensures consistent spacing and a clean look.

```html
<section class='bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto'>
  <h2 class='text-2xl font-bold text-center mb-6'>A Note from Our Founder</h2>
  <p class='text-gray-700 mb-6'>We are committed to excellence and value your feedback. Here’s what our customers have to say:</p>
  <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
    <div class='bg-gray-50 p-4 rounded-lg shadow'>
      <p class='text-gray-600'>"This company changed my life!" - Jane D.</p>
    </div>
    <div class='bg-gray-50 p-4 rounded-lg shadow'>
      <p class='text-gray-600'>"Exceptional service and quality!" - John S.</p>
    </div>
  </div>
  <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mt-6 inline-block'>Join Our Community</a>
</section>
```

## `founder-note` / `spotlight`

### Example 1: Founder Spotlight with Image

**When To Use**: Use this layout to highlight the founder's message alongside their image, creating a personal connection with the audience.

**Why It Works**: The use of contrasting colors and clear typography draws attention to the founder's note. The image adds a personal touch, enhancing relatability and trust.

**Tailwind Notes**:
- Flexbox layout for responsive design.
- Utilizes spacing for clear separation of elements.
- Strong emphasis on the CTA button with color contrast.

```html
<section class='bg-gray-50 p-8 md:flex md:items-center md:justify-between'>
  <div class='md:w-1/2 md:pr-8'>
    <h2 class='text-3xl font-bold text-gray-800'>A Note from Our Founder</h2>
    <p class='mt-4 text-lg text-gray-600'>Welcome to our journey! We are committed to bringing you the best products and services that meet your needs.</p>
    <a href='#' class='mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700'>Learn More</a>
  </div>
  <div class='mt-6 md:mt-0 md:w-1/2'>
    <img src='founder.jpg' alt='Founder Image' class='rounded-lg shadow-lg w-full h-auto' />
  </div>
</section>
```

### Example 2: Founder Note with Background Pattern

**When To Use**: This variant is ideal for a more visually engaging presentation of the founder's note, suitable for creative brands.

**Why It Works**: The patterned background adds depth and interest, while the contrasting text and button ensure readability and clear action pathways.

**Tailwind Notes**:
- Background pattern for visual interest.
- Color contrast for text readability.
- Responsive design ensures accessibility on all devices.

```html
<section class='bg-[url("/path/to/pattern.png")] bg-cover p-8 text-white'>
  <div class='max-w-xl mx-auto text-center'>
    <h2 class='text-4xl font-extrabold'>From the Desk of Our Founder</h2>
    <p class='mt-4 text-lg'>Join us in our mission to innovate and inspire. Your support makes all the difference!</p>
    <a href='#' class='mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full shadow-lg'>Get Involved</a>
  </div>
</section>
```

### Example 3: Founder Note with Testimonial Cards

**When To Use**: Use this layout to feature multiple testimonials from the founder, showcasing their vision and impact through customer stories.

**Why It Works**: The card layout allows for easy scanning of testimonials, while the consistent styling maintains brand identity and encourages engagement.

**Tailwind Notes**:
- Grid layout for responsive card arrangement.
- Consistent card styling for a cohesive look.
- Hover effects on cards for interactivity.

```html
<section class='p-8 bg-white'>
  <h2 class='text-3xl font-bold text-center mb-6'>What Our Founder Believes</h2>
  <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
    <div class='bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition'>
      <p class='text-lg text-gray-700'>"Our customers inspire us every day to push the boundaries of innovation."</p>
      <p class='mt-2 font-semibold text-gray-900'>- Founder Name</p>
    </div>
    <div class='bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition'>
      <p class='text-lg text-gray-700'>"Together, we can create a brighter future for everyone involved."</p>
      <p class='mt-2 font-semibold text-gray-900'>- Founder Name</p>
    </div>
    <div class='bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition'>
      <p class='text-lg text-gray-700'>"Your trust and support fuel our passion for excellence."</p>
      <p class='mt-2 font-semibold text-gray-900'>- Founder Name</p>
    </div>
  </div>
</section>
```

## `founder-note` / `portrait`

### Example 1: Founder Spotlight with Quote

**When To Use**: When highlighting a founder's vision with a personal touch.

**Why It Works**: The layout draws attention to the founder's portrait and quote, creating a personal connection with the audience. The use of contrasting colors and ample white space enhances readability and focus.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Emphasizes typography with larger text sizes and bold weights.
- Incorporates a subtle background for depth.

```html
<section class='flex flex-col items-center bg-gray-50 p-8 md:flex-row md:justify-between md:p-12'>
  <div class='mb-6 md:mb-0 md:w-1/3'>
    <img src='founder.jpg' alt='Founder Portrait' class='rounded-full shadow-lg w-32 h-32 md:w-48 md:h-48' />
  </div>
  <div class='md:w-2/3 md:pl-6'>
    <h2 class='text-2xl font-bold text-gray-800 mb-4'>A Note from Our Founder</h2>
    <p class='text-lg text-gray-600 mb-4'>"Our mission is to innovate and inspire, pushing the boundaries of what's possible in our industry. We believe in the power of community and collaboration."</p>
    <a href='#' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300'>Learn More</a>
  </div>
</section>
```

### Example 2: Personal Message with Background Overlay

**When To Use**: To convey a heartfelt message from the founder while maintaining brand aesthetics.

**Why It Works**: The background overlay creates a visually appealing contrast, making the text stand out. The use of rounded corners and shadows gives a modern feel, while the CTA is prominent and inviting.

**Tailwind Notes**:
- Background gradient for visual interest.
- Text shadow for improved readability against the background.
- Responsive adjustments for mobile and desktop views.

```html
<section class='relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 md:p-12'>
  <div class='absolute inset-0 bg-black opacity-25 rounded-lg'></div>
  <div class='relative z-10'>
    <h2 class='text-3xl font-extrabold mb-4'>Message from Our Founder</h2>
    <p class='text-lg mb-6'>"Together, we are building a future where innovation meets integrity. Join us on this journey!"</p>
    <a href='#' class='inline-block bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-gray-200 transition duration-300'>Discover More</a>
  </div>
</section>
```

### Example 3: Founder Introduction with Testimonials

**When To Use**: When the founder's message is complemented by customer testimonials to build trust.

**Why It Works**: The grid layout allows for a clean presentation of the founder's note alongside testimonials, enhancing credibility. The use of cards for testimonials keeps the section organized and visually appealing.

**Tailwind Notes**:
- Grid layout for responsive testimonial cards.
- Consistent spacing and alignment for a polished look.
- Hover effects on cards to encourage interaction.

```html
<section class='p-8 bg-white'>
  <h2 class='text-2xl font-bold text-gray-800 mb-6 text-center'>From Our Founder</h2>
  <p class='text-lg text-gray-600 mb-12 text-center'>"We are committed to excellence and driven by our customers' success. Here's what they say about us."</p>
  <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
    <div class='bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition duration-300'>
      <p class='text-gray-700'>"An amazing experience! Highly recommend."</p>
      <p class='text-gray-500 text-sm mt-2'>- Customer A</p>
    </div>
    <div class='bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition duration-300'>
      <p class='text-gray-700'>"Exceptional service and support!"</p>
      <p class='text-gray-500 text-sm mt-2'>- Customer B</p>
    </div>
    <div class='bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition duration-300'>
      <p class='text-gray-700'>"I love their products!"</p>
      <p class='text-gray-500 text-sm mt-2'>- Customer C</p>
    </div>
  </div>
</section>
```

## `timeline` / `vertical`

### Example 1: Company Milestones Timeline

**When To Use**: Use this timeline to showcase significant milestones in your company's history, creating a narrative that builds trust and engagement.

**Why It Works**: The layout provides a clear chronological flow, guiding users through the company's achievements while maintaining visual interest with alternating background colors.

**Tailwind Notes**:
- Utilizes spacing and background colors to create visual separation between timeline events.
- Employs responsive utility classes to ensure readability on all devices.

```html
<section class='py-16 bg-gray-50'><div class='max-w-7xl mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Our Journey</h2><div class='relative'><div class='absolute left-1/2 transform -translate-x-1/2 h-full border-l border-gray-300'></div><div class='mb-12 flex items-start justify-start'><div class='relative z-10 w-8 h-8 bg-blue-500 rounded-full shadow-md'></div><div class='ml-4'><h3 class='text-lg font-semibold text-gray-800'>Founded in 2010</h3><p class='mt-1 text-gray-600'>Our company was established with a mission to innovate.</p></div></div><div class='mb-12 flex items-start justify-start'><div class='relative z-10 w-8 h-8 bg-blue-500 rounded-full shadow-md'></div><div class='ml-4'><h3 class='text-lg font-semibold text-gray-800'>Launched First Product in 2015</h3><p class='mt-1 text-gray-600'>We introduced our flagship product to the market.</p></div></div><div class='mb-12 flex items-start justify-start'><div class='relative z-10 w-8 h-8 bg-blue-500 rounded-full shadow-md'></div><div class='ml-4'><h3 class='text-lg font-semibold text-gray-800'>Reached 1 Million Users in 2020</h3><p class='mt-1 text-gray-600'>Our user base grew exponentially, validating our vision.</p></div></div></div></div></section>
```

### Example 2: Project Development Timeline

**When To Use**: Ideal for showcasing the phases of a project, helping users understand the process and timeline for completion.

**Why It Works**: The alternating background colors enhance readability and keep the user engaged while the clear headings and descriptions provide essential information at a glance.

**Tailwind Notes**:
- Alternating background colors improve visual hierarchy and help differentiate between events.
- Generous padding and margins ensure that the content is not cramped, enhancing legibility.

```html
<section class='py-16'><div class='max-w-6xl mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Project Timeline</h2><div class='relative'><div class='absolute left-1/2 transform -translate-x-1/2 h-full border-l border-gray-300'></div><div class='mb-12 flex items-start justify-start bg-white p-4 rounded-lg shadow-md'><div class='relative z-10 w-8 h-8 bg-green-500 rounded-full shadow-md'></div><div class='ml-4'><h3 class='text-lg font-semibold text-gray-800'>Phase 1: Research</h3><p class='mt-1 text-gray-600'>Conducting market research and gathering user feedback.</p></div></div><div class='mb-12 flex items-start justify-start bg-gray-100 p-4 rounded-lg shadow-md'><div class='relative z-10 w-8 h-8 bg-green-500 rounded-full shadow-md'></div><div class='ml-4'><h3 class='text-lg font-semibold text-gray-800'>Phase 2: Development</h3><p class='mt-1 text-gray-600'>Building the product with an agile approach.</p></div></div><div class='mb-12 flex items-start justify-start bg-white p-4 rounded-lg shadow-md'><div class='relative z-10 w-8 h-8 bg-green-500 rounded-full shadow-md'></div><div class='ml-4'><h3 class='text-lg font-semibold text-gray-800'>Phase 3: Launch</h3><p class='mt-1 text-gray-600'>Officially launching the product to the public.</p></div></div></div></div></section>
```

## `timeline` / `milestones`

### Example 1: Product Development Timeline

**When To Use**: Use this layout to showcase key milestones in product development, highlighting achievements and future goals.

**Why It Works**: The clear visual hierarchy and contrasting colors guide the user’s eye through the timeline, making it easy to digest information quickly. The use of cards for milestones provides a clean and organized presentation.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Incorporates ample padding and margin for breathing space.
- Uses contrasting colors for emphasis on CTAs.

```html
<section class='py-12 bg-gray-50'><div class='max-w-6xl mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Our Product Journey</h2><div class='flex flex-col md:flex-row justify-between items-start'><div class='flex-1 mb-6'><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-2'>Phase 1: Research</h3><p class='text-gray-600 mb-4'>Conducted market analysis and gathered user feedback.</p><a href='#' class='text-blue-500 font-medium hover:underline'>Learn More</a></div></div><div class='flex-1 mb-6'><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-2'>Phase 2: Development</h3><p class='text-gray-600 mb-4'>Built the first prototype and tested with users.</p><a href='#' class='text-blue-500 font-medium hover:underline'>Learn More</a></div></div><div class='flex-1 mb-6'><div class='bg-white shadow-lg rounded-lg p-6'><h3 class='text-xl font-semibold mb-2'>Phase 3: Launch</h3><p class='text-gray-600 mb-4'>Officially launched the product to the public.</p><a href='#' class='text-blue-500 font-medium hover:underline'>Learn More</a></div></div></div></div></section>
```

### Example 2: Company Milestones Timeline

**When To Use**: Ideal for showcasing the history and growth of a company through significant milestones.

**Why It Works**: The use of alternating background colors for each milestone creates a visual rhythm, enhancing engagement. The timeline format allows users to easily follow the company’s journey while the CTAs encourage further exploration.

**Tailwind Notes**:
- Alternating background colors improve readability.
- Responsive grid layout ensures adaptability on different screen sizes.
- Consistent typography enhances brand identity.

```html
<section class='py-12'><div class='max-w-6xl mx-auto px-4'><h2 class='text-3xl font-bold text-center mb-8'>Our Milestones</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-6'><div class='bg-gray-100 p-6 rounded-lg shadow'><h3 class='text-xl font-semibold mb-2'>2010: Founded</h3><p class='text-gray-700 mb-4'>Started our journey with a mission to innovate.</p><a href='#' class='text-blue-500 font-medium hover:underline'>Read More</a></div><div class='bg-white p-6 rounded-lg shadow'><h3 class='text-xl font-semibold mb-2'>2015: First Product Launch</h3><p class='text-gray-700 mb-4'>Launched our first product, changing the market landscape.</p><a href='#' class='text-blue-500 font-medium hover:underline'>Read More</a></div><div class='bg-gray-100 p-6 rounded-lg shadow'><h3 class='text-xl font-semibold mb-2'>2020: Reached 1M Users</h3><p class='text-gray-700 mb-4'>Celebrated a major milestone in user growth.</p><a href='#' class='text-blue-500 font-medium hover:underline'>Read More</a></div><div class='bg-white p-6 rounded-lg shadow'><h3 class='text-xl font-semibold mb-2'>2023: Global Expansion</h3><p class='text-gray-700 mb-4'>Expanded our services to new international markets.</p><a href='#' class='text-blue-500 font-medium hover:underline'>Read More</a></div></div></div></section>
```

## `timeline` / `horizontal`

### Example 1: Product Development Timeline

**When To Use**: Use this timeline to showcase the development phases of a product or service, highlighting key milestones.

**Why It Works**: The horizontal layout allows for a clear and linear representation of time, making it easy for users to follow the progression of events. The use of contrasting colors and ample spacing creates visual clarity, while the CTA encourages user engagement.

**Tailwind Notes**:
- Utilizes flexbox for horizontal alignment and spacing.
- Incorporates responsive design for mobile-friendliness.
- Emphasizes CTAs with distinct styling.

```html
<section class='py-10 bg-gray-50'>
  <div class='container mx-auto px-4'>
    <h2 class='text-3xl font-bold text-center mb-6'>Our Product Development Journey</h2>
    <div class='flex flex-col md:flex-row md:space-x-8'>
      <div class='flex-1 mb-6'>
        <div class='bg-white shadow-lg p-6 rounded-lg'>
          <h3 class='text-xl font-semibold'>Phase 1: Research</h3>
          <p class='text-gray-600'>Conducting market analysis and gathering user feedback.</p>
        </div>
      </div>
      <div class='flex-1 mb-6'>
        <div class='bg-white shadow-lg p-6 rounded-lg'>
          <h3 class='text-xl font-semibold'>Phase 2: Design</h3>
          <p class='text-gray-600'>Creating wireframes and prototypes to visualize the product.</p>
        </div>
      </div>
      <div class='flex-1 mb-6'>
        <div class='bg-white shadow-lg p-6 rounded-lg'>
          <h3 class='text-xl font-semibold'>Phase 3: Development</h3>
          <p class='text-gray-600'>Building the product with a focus on quality and performance.</p>
        </div>
      </div>
    </div>
    <div class='text-center mt-8'>
      <a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Learn More</a>
    </div>
  </div>
</section>
```

### Example 2: Company Milestones Timeline

**When To Use**: Ideal for showcasing significant achievements or milestones in a company's history, enhancing brand storytelling.

**Why It Works**: The horizontal timeline format allows users to easily digest information about the company's growth. The use of icons adds a visual element that aids in recognition and retention, while the clear typography ensures readability.

**Tailwind Notes**:
- Incorporates icons for enhanced visual storytelling.
- Utilizes responsive design to stack items on smaller screens.
- Maintains a clean layout with ample whitespace.

```html
<section class='py-12 bg-white'>
  <div class='container mx-auto px-4'>
    <h2 class='text-4xl font-bold text-center mb-8'>Our Milestones</h2>
    <div class='flex flex-col md:flex-row md:space-x-10'>
      <div class='flex-1 mb-6'>
        <div class='flex items-center bg-gray-100 p-4 rounded-lg shadow'>
          <div class='mr-4'><i class='fas fa-star text-blue-600 text-2xl'></i></div>
          <div>
            <h3 class='text-lg font-semibold'>2015: Founded</h3>
            <p class='text-gray-700'>Started our journey with a vision to innovate.</p>
          </div>
        </div>
      </div>
      <div class='flex-1 mb-6'>
        <div class='flex items-center bg-gray-100 p-4 rounded-lg shadow'>
          <div class='mr-4'><i class='fas fa-rocket text-blue-600 text-2xl'></i></div>
          <div>
            <h3 class='text-lg font-semibold'>2018: First Product Launch</h3>
            <p class='text-gray-700'>Launched our flagship product, receiving rave reviews.</p>
          </div>
        </div>
      </div>
      <div class='flex-1 mb-6'>
        <div class='flex items-center bg-gray-100 p-4 rounded-lg shadow'>
          <div class='mr-4'><i class='fas fa-users text-blue-600 text-2xl'></i></div>
          <div>
            <h3 class='text-lg font-semibold'>2021: Reached 1M Users</h3>
            <p class='text-gray-700'>Celebrated a major milestone in user growth.</p>
          </div>
        </div>
      </div>
    </div>
    <div class='text-center mt-10'>
      <a href='#' class='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition'>Join Us</a>
    </div>
  </div>
</section>
```

## `gallery` / `grid`

### Example 1: Product Showcase

**When To Use**: Use this layout to display a collection of products or portfolio items, emphasizing visual appeal and clear calls to action.

**Why It Works**: The grid layout provides a clean and organized presentation of items, while the use of hover effects and responsive design enhances user interaction and engagement.

**Tailwind Notes**:
- Utilizes grid layout for responsive design.
- Hover effects create interactivity.
- Consistent spacing ensures a polished look.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Products</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg overflow-hidden'><img src='product1.jpg' alt='Product 1' class='w-full h-48 object-cover'><div class='p-4'><h3 class='text-lg font-semibold'>Product 1</h3><p class='text-gray-600'>Short description of the product.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>View Details</a></div></div><div class='bg-white shadow-lg rounded-lg overflow-hidden'><img src='product2.jpg' alt='Product 2' class='w-full h-48 object-cover'><div class='p-4'><h3 class='text-lg font-semibold'>Product 2</h3><p class='text-gray-600'>Short description of the product.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>View Details</a></div></div><div class='bg-white shadow-lg rounded-lg overflow-hidden'><img src='product3.jpg' alt='Product 3' class='w-full h-48 object-cover'><div class='p-4'><h3 class='text-lg font-semibold'>Product 3</h3><p class='text-gray-600'>Short description of the product.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>View Details</a></div></div></div></div></section>
```

### Example 2: Portfolio Gallery

**When To Use**: Ideal for showcasing a creative portfolio, where visual storytelling is key to attracting clients or customers.

**Why It Works**: The use of varied image sizes and a masonry-like effect draws attention to each piece, while clear headings and CTAs guide users effectively.

**Tailwind Notes**:
- Responsive grid adapts to screen sizes.
- Masonry effect achieved with varying item heights.
- Strong typography and CTA visibility enhance engagement.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-4xl font-bold text-center mb-10'>Our Work</h2><div class='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'><div class='bg-gray-200 rounded-lg overflow-hidden'><img src='portfolio1.jpg' alt='Project 1' class='w-full h-64 object-cover'><div class='p-4'><h3 class='text-xl font-semibold'>Project 1</h3><p class='text-gray-700'>Brief description of the project.</p><a href='#' class='mt-2 inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition'>View Project</a></div></div><div class='bg-gray-200 rounded-lg overflow-hidden'><img src='portfolio2.jpg' alt='Project 2' class='w-full h-80 object-cover'><div class='p-4'><h3 class='text-xl font-semibold'>Project 2</h3><p class='text-gray-700'>Brief description of the project.</p><a href='#' class='mt-2 inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition'>View Project</a></div></div><div class='bg-gray-200 rounded-lg overflow-hidden'><img src='portfolio3.jpg' alt='Project 3' class='w-full h-72 object-cover'><div class='p-4'><h3 class='text-xl font-semibold'>Project 3</h3><p class='text-gray-700'>Brief description of the project.</p><a href='#' class='mt-2 inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition'>View Project</a></div></div></div></div></section>
```

## `gallery` / `masonry`

### Example 1: Masonry Gallery with Hover Effects

**When To Use**: Use this layout to showcase a collection of images or products with an engaging hover effect that draws attention.

**Why It Works**: The masonry layout creates a visually dynamic presentation, while the hover effects enhance interactivity, encouraging users to explore more.

**Tailwind Notes**:
- Use 'grid' and 'gap' utilities for responsive masonry layout.
- Apply 'transition' and 'transform' utilities for smooth hover effects.
- Ensure images are responsive with 'object-cover' to maintain aspect ratio.

```html
<section class="py-12 bg-gray-50"><div class="max-w-7xl mx-auto"><h2 class="text-3xl font-bold text-center mb-8">Explore Our Gallery</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div class="group overflow-hidden rounded-lg shadow-lg"><img src="image1.jpg" alt="Gallery Image 1" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" /><div class="p-4"><h3 class="text-lg font-semibold">Image Title 1</h3><p class="text-gray-600">Short description of the image.</p></div></div><div class="group overflow-hidden rounded-lg shadow-lg"><img src="image2.jpg" alt="Gallery Image 2" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" /><div class="p-4"><h3 class="text-lg font-semibold">Image Title 2</h3><p class="text-gray-600">Short description of the image.</p></div></div><div class="group overflow-hidden rounded-lg shadow-lg"><img src="image3.jpg" alt="Gallery Image 3" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" /><div class="p-4"><h3 class="text-lg font-semibold">Image Title 3</h3><p class="text-gray-600">Short description of the image.</p></div></div></div></div></section>
```

### Example 2: Masonry Gallery with CTA Buttons

**When To Use**: Ideal for showcasing products or portfolio pieces with a clear call to action for each item.

**Why It Works**: The inclusion of CTA buttons encourages user interaction, while the masonry layout keeps the design visually engaging and organized.

**Tailwind Notes**:
- 'flex' and 'flex-col' for vertical alignment of text and button.
- Use 'bg-white' for cards to create contrast against the background.
- Employ 'hover:bg-blue-500' for CTA buttons for a clear interactive cue.

```html
<section class="py-12 bg-gray-100"><div class="max-w-7xl mx-auto"><h2 class="text-3xl font-bold text-center mb-8">Our Featured Works</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div class="bg-white rounded-lg shadow-lg overflow-hidden"><img src="product1.jpg" alt="Product 1" class="w-full h-48 object-cover" /><div class="p-4"><h3 class="text-lg font-semibold">Product Title 1</h3><p class="text-gray-600">Brief description of the product.</p><a href="#" class="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition">View More</a></div></div><div class="bg-white rounded-lg shadow-lg overflow-hidden"><img src="product2.jpg" alt="Product 2" class="w-full h-48 object-cover" /><div class="p-4"><h3 class="text-lg font-semibold">Product Title 2</h3><p class="text-gray-600">Brief description of the product.</p><a href="#" class="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition">View More</a></div></div><div class="bg-white rounded-lg shadow-lg overflow-hidden"><img src="product3.jpg" alt="Product 3" class="w-full h-48 object-cover" /><div class="p-4"><h3 class="text-lg font-semibold">Product Title 3</h3><p class="text-gray-600">Brief description of the product.</p><a href="#" class="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition">View More</a></div></div></div></div></section>
```

## `gallery` / `carousel`

### Example 1: Product Showcase Carousel

**When To Use**: Use this carousel to highlight featured products on an e-commerce landing page.

**Why It Works**: The layout emphasizes product images and includes clear CTAs, making it easy for users to engage with the offerings. The use of shadows and rounded corners enhances the visual appeal.

**Tailwind Notes**:
- Utilizes flexbox for horizontal alignment of items.
- Responsive design ensures a good experience on all devices.
- Hover effects on cards encourage interaction.

```html
<section class='py-12 bg-gray-100'>
  <h2 class='text-3xl font-semibold text-center mb-8'>Featured Products</h2>
  <div class='flex overflow-x-auto space-x-4 px-4'>
    <div class='min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden'>
      <img src='product1.jpg' alt='Product 1' class='w-full h-48 object-cover'>
      <div class='p-4'>
        <h3 class='text-lg font-bold'>Product 1</h3>
        <p class='text-gray-600'>$29.99</p>
        <a href='#' class='mt-2 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Buy Now</a>
      </div>
    </div>
    <div class='min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden'>
      <img src='product2.jpg' alt='Product 2' class='w-full h-48 object-cover'>
      <div class='p-4'>
        <h3 class='text-lg font-bold'>Product 2</h3>
        <p class='text-gray-600'>$39.99</p>
        <a href='#' class='mt-2 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Buy Now</a>
      </div>
    </div>
    <div class='min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden'>
      <img src='product3.jpg' alt='Product 3' class='w-full h-48 object-cover'>
      <div class='p-4'>
        <h3 class='text-lg font-bold'>Product 3</h3>
        <p class='text-gray-600'>$49.99</p>
        <a href='#' class='mt-2 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Buy Now</a>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Portfolio Carousel

**When To Use**: Ideal for showcasing a portfolio of work or projects on a creative agency's website.

**Why It Works**: The clean design with ample whitespace and contrasting text allows the visuals to stand out. The rounded corners and shadows create depth, making it visually engaging.

**Tailwind Notes**:
- Emphasizes visual hierarchy with larger headings.
- Uses a consistent card layout for each portfolio item.
- Responsive design ensures images scale well on different devices.

```html
<section class='py-16 bg-white'>
  <h2 class='text-4xl font-bold text-center mb-10'>Our Work</h2>
  <div class='flex overflow-x-auto space-x-6 px-6'>
    <div class='min-w-[300px] bg-gray-200 rounded-lg shadow-md overflow-hidden'>
      <img src='project1.jpg' alt='Project 1' class='w-full h-64 object-cover'>
      <div class='p-4'>
        <h3 class='text-xl font-semibold'>Project 1</h3>
        <p class='text-gray-700'>Brief description of the project.</p>
        <a href='#' class='mt-3 inline-block text-blue-600 hover:underline'>View Project</a>
      </div>
    </div>
    <div class='min-w-[300px] bg-gray-200 rounded-lg shadow-md overflow-hidden'>
      <img src='project2.jpg' alt='Project 2' class='w-full h-64 object-cover'>
      <div class='p-4'>
        <h3 class='text-xl font-semibold'>Project 2</h3>
        <p class='text-gray-700'>Brief description of the project.</p>
        <a href='#' class='mt-3 inline-block text-blue-600 hover:underline'>View Project</a>
      </div>
    </div>
    <div class='min-w-[300px] bg-gray-200 rounded-lg shadow-md overflow-hidden'>
      <img src='project3.jpg' alt='Project 3' class='w-full h-64 object-cover'>
      <div class='p-4'>
        <h3 class='text-xl font-semibold'>Project 3</h3>
        <p class='text-gray-700'>Brief description of the project.</p>
        <a href='#' class='mt-3 inline-block text-blue-600 hover:underline'>View Project</a>
      </div>
    </div>
  </div>
</section>
```

## `gallery` / `before-after`

### Example 1: Home Renovation Before & After

**When To Use**: Use this section to showcase dramatic transformations in home renovation projects, highlighting the effectiveness of your services.

**Why It Works**: The clear before-and-after layout creates a strong visual impact, while the use of contrasting colors and spacious layout draws attention to the transformations.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Incorporates shadow and rounded corners for a polished look.
- Emphasizes CTAs with contrasting colors.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Transformations That Inspire</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-6'><div class='relative overflow-hidden rounded-lg shadow-lg'><img src='before.jpg' alt='Before Renovation' class='w-full h-64 object-cover'><div class='absolute inset-0 bg-black opacity-50 flex items-center justify-center'><span class='text-white text-xl font-semibold'>Before</span></div></div><div class='relative overflow-hidden rounded-lg shadow-lg'><img src='after.jpg' alt='After Renovation' class='w-full h-64 object-cover'><div class='absolute inset-0 bg-black opacity-50 flex items-center justify-center'><span class='text-white text-xl font-semibold'>After</span></div></div></div><div class='text-center mt-8'><a href='#contact' class='bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-300'>Get Your Free Estimate</a></div></div></section>
```

### Example 2: Fitness Transformation Showcase

**When To Use**: Ideal for fitness coaches or gyms to display client transformations, motivating potential customers to join.

**Why It Works**: The combination of large images and clear text overlays creates a compelling narrative, while the CTA's color scheme encourages engagement.

**Tailwind Notes**:
- Uses grid layout for responsive design.
- Text overlays enhance readability against images.
- Hover effects on CTAs improve interactivity.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-4xl font-bold text-center mb-10'>Real Results, Real People</h2><div class='grid grid-cols-1 md:grid-cols-2 gap-8'><div class='relative'><img src='client_before.jpg' alt='Client Before' class='w-full h-80 object-cover rounded-lg shadow-lg'><div class='absolute inset-0 bg-black opacity-40 flex items-center justify-center'><span class='text-white text-2xl font-bold'>Before</span></div></div><div class='relative'><img src='client_after.jpg' alt='Client After' class='w-full h-80 object-cover rounded-lg shadow-lg'><div class='absolute inset-0 bg-black opacity-40 flex items-center justify-center'><span class='text-white text-2xl font-bold'>After</span></div></div></div><div class='text-center mt-10'><a href='#join' class='bg-green-500 text-white py-4 px-8 rounded-lg shadow hover:bg-green-600 transition duration-300'>Join Our Community</a></div></div></section>
```

## `gallery` / `captioned`

### Example 1: Image Gallery with Captions

**When To Use**: Use this layout to showcase products or portfolio pieces with brief descriptions, ideal for landing pages or marketing sites.

**Why It Works**: The use of a grid layout with clear captions enhances visual hierarchy, making it easy for users to engage with each item. The responsive design ensures a seamless experience across devices.

**Tailwind Notes**:
- Grid layout for responsive image arrangement.
- Consistent padding and margin for visual clarity.
- Hover effects to indicate interactivity.

```html
<section class='py-12 bg-gray-50'>
  <div class='container mx-auto px-4'>
    <h2 class='text-3xl font-bold text-center mb-8'>Our Featured Work</h2>
    <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div class='bg-white rounded-lg shadow-md overflow-hidden'>
        <img src='image1.jpg' alt='Project 1' class='w-full h-48 object-cover'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Project Title 1</h3>
          <p class='text-gray-600'>A brief description of the project highlighting its key features.</p>
        </div>
      </div>
      <div class='bg-white rounded-lg shadow-md overflow-hidden'>
        <img src='image2.jpg' alt='Project 2' class='w-full h-48 object-cover'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Project Title 2</h3>
          <p class='text-gray-600'>A brief description of the project highlighting its key features.</p>
        </div>
      </div>
      <div class='bg-white rounded-lg shadow-md overflow-hidden'>
        <img src='image3.jpg' alt='Project 3' class='w-full h-48 object-cover'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Project Title 3</h3>
          <p class='text-gray-600'>A brief description of the project highlighting its key features.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Product Showcase with Interactive Captions

**When To Use**: Ideal for e-commerce sites to display products with interactive captions that encourage user engagement.

**Why It Works**: The combination of hover effects and clear call-to-action buttons under each image invites users to explore products further, enhancing conversion potential.

**Tailwind Notes**:
- Hover effects on images for interactivity.
- CTA buttons styled for visibility and action.
- Consistent use of colors for branding.

```html
<section class='py-12 bg-white'>
  <div class='container mx-auto px-4'>
    <h2 class='text-3xl font-bold text-center mb-8'>Explore Our Products</h2>
    <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      <div class='bg-gray-100 rounded-lg overflow-hidden transition-transform transform hover:scale-105'>
        <img src='product1.jpg' alt='Product 1' class='w-full h-48 object-cover'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Product Name 1</h3>
          <p class='text-gray-600'>$29.99</p>
          <a href='#' class='mt-2 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>View Details</a>
        </div>
      </div>
      <div class='bg-gray-100 rounded-lg overflow-hidden transition-transform transform hover:scale-105'>
        <img src='product2.jpg' alt='Product 2' class='w-full h-48 object-cover'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Product Name 2</h3>
          <p class='text-gray-600'>$39.99</p>
          <a href='#' class='mt-2 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>View Details</a>
        </div>
      </div>
      <div class='bg-gray-100 rounded-lg overflow-hidden transition-transform transform hover:scale-105'>
        <img src='product3.jpg' alt='Product 3' class='w-full h-48 object-cover'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Product Name 3</h3>
          <p class='text-gray-600'>$49.99</p>
          <a href='#' class='mt-2 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>View Details</a>
        </div>
      </div>
      <div class='bg-gray-100 rounded-lg overflow-hidden transition-transform transform hover:scale-105'>
        <img src='product4.jpg' alt='Product 4' class='w-full h-48 object-cover'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Product Name 4</h3>
          <p class='text-gray-600'>$59.99</p>
          <a href='#' class='mt-2 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>View Details</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

## `video-showcase` / `grid`

### Example 1: Video Showcase with Overlay Text

**When To Use**: Use this layout to highlight multiple videos with descriptive text overlays for each video, ideal for showcasing tutorials or product demos.

**Why It Works**: The overlay text provides context and encourages user engagement with clear CTAs. The grid layout ensures that videos are displayed uniformly, enhancing visual appeal and accessibility.

**Tailwind Notes**:
- Utilizes a responsive grid layout for versatility across devices.
- Employs contrasting text colors on overlays for readability.
- Includes hover effects to enhance interactivity.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Watch Our Videos</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='relative overflow-hidden rounded-lg shadow-lg'><video class='w-full h-auto' src='video1.mp4' controls></video><div class='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold opacity-0 hover:opacity-100 transition-opacity'><a href='#' class='bg-blue-500 px-4 py-2 rounded'>Watch Now</a></div></div><div class='relative overflow-hidden rounded-lg shadow-lg'><video class='w-full h-auto' src='video2.mp4' controls></video><div class='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold opacity-0 hover:opacity-100 transition-opacity'><a href='#' class='bg-blue-500 px-4 py-2 rounded'>Watch Now</a></div></div><div class='relative overflow-hidden rounded-lg shadow-lg'><video class='w-full h-auto' src='video3.mp4' controls></video><div class='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold opacity-0 hover:opacity-100 transition-opacity'><a href='#' class='bg-blue-500 px-4 py-2 rounded'>Watch Now</a></div></div></div></div></section>
```

### Example 2: Video Showcase with Thumbnails and Descriptions

**When To Use**: Ideal for a marketing site aiming to provide a quick overview of featured videos with thumbnails and brief descriptions.

**Why It Works**: The structured layout with thumbnails and descriptions improves content digestibility. The use of whitespace and consistent styling creates a polished look.

**Tailwind Notes**:
- Uses flexbox for alignment and spacing between elements.
- Employs consistent card styles for a cohesive appearance.
- Responsive design ensures usability on mobile devices.

```html
<section class='py-12 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Featured Videos</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'><div class='bg-gray-200 rounded-lg overflow-hidden shadow-md'><img class='w-full h-48 object-cover' src='thumbnail1.jpg' alt='Video 1'><div class='p-4'><h3 class='text-xl font-semibold'>Video Title 1</h3><p class='text-gray-700 mb-4'>Short description of the video goes here.</p><a href='#' class='inline-block bg-blue-500 text-white px-4 py-2 rounded'>Watch Now</a></div></div><div class='bg-gray-200 rounded-lg overflow-hidden shadow-md'><img class='w-full h-48 object-cover' src='thumbnail2.jpg' alt='Video 2'><div class='p-4'><h3 class='text-xl font-semibold'>Video Title 2</h3><p class='text-gray-700 mb-4'>Short description of the video goes here.</p><a href='#' class='inline-block bg-blue-500 text-white px-4 py-2 rounded'>Watch Now</a></div></div><div class='bg-gray-200 rounded-lg overflow-hidden shadow-md'><img class='w-full h-48 object-cover' src='thumbnail3.jpg' alt='Video 3'><div class='p-4'><h3 class='text-xl font-semibold'>Video Title 3</h3><p class='text-gray-700 mb-4'>Short description of the video goes here.</p><a href='#' class='inline-block bg-blue-500 text-white px-4 py-2 rounded'>Watch Now</a></div></div></div></div></section>
```

## `video-showcase` / `featured`

### Example 1: Highlighted Video Showcase

**When To Use**: Use this layout to feature a primary video alongside a grid of related videos, ideal for landing pages focused on video content.

**Why It Works**: The large featured video draws immediate attention, while the grid layout of related videos provides easy access to more content. The use of spacing and contrast enhances readability and engagement.

**Tailwind Notes**:
- Utilizes flex and grid utilities for responsive layout.
- Emphasizes the primary video with larger dimensions and padding.
- Maintains a clean aesthetic with ample white space and contrasting colors.

```html
<section class='py-16 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Featured Videos</h2><div class='flex justify-center mb-8'><video class='w-full md:w-2/3 rounded-lg shadow-lg' controls><source src='featured-video.mp4' type='video/mp4'>Your browser does not support the video tag.</video></div><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white rounded-lg shadow-md overflow-hidden'><video class='w-full' controls><source src='video1.mp4' type='video/mp4'></video><div class='p-4'><h3 class='font-semibold text-lg'>Video Title 1</h3><p class='text-gray-600'>Short description of video 1.</p></div></div><div class='bg-white rounded-lg shadow-md overflow-hidden'><video class='w-full' controls><source src='video2.mp4' type='video/mp4'></video><div class='p-4'><h3 class='font-semibold text-lg'>Video Title 2</h3><p class='text-gray-600'>Short description of video 2.</p></div></div><div class='bg-white rounded-lg shadow-md overflow-hidden'><video class='w-full' controls><source src='video3.mp4' type='video/mp4'></video><div class='p-4'><h3 class='font-semibold text-lg'>Video Title 3</h3><p class='text-gray-600'>Short description of video 3.</p></div></div></div></div></section>
```

### Example 2: Interactive Video Gallery

**When To Use**: Ideal for showcasing multiple videos in a more interactive manner, perfect for educational or promotional content.

**Why It Works**: The layout encourages user interaction with hover effects and clear CTAs, while the structured grid allows for easy navigation through video content.

**Tailwind Notes**:
- Incorporates hover effects for interactivity.
- Uses responsive grid to adapt to different screen sizes.
- Highlights CTAs with contrasting colors and prominent placement.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-4xl font-bold text-center mb-10'>Explore Our Videos</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'><div class='group bg-gray-200 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105'><video class='w-full' controls><source src='video4.mp4' type='video/mp4'></video><div class='p-4'><h3 class='font-semibold text-lg'>Video Title 4</h3><p class='text-gray-700'>Brief description of video 4.</p><a href='#' class='mt-2 inline-block text-blue-600 font-semibold'>Watch Now</a></div></div><div class='group bg-gray-200 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105'><video class='w-full' controls><source src='video5.mp4' type='video/mp4'></video><div class='p-4'><h3 class='font-semibold text-lg'>Video Title 5</h3><p class='text-gray-700'>Brief description of video 5.</p><a href='#' class='mt-2 inline-block text-blue-600 font-semibold'>Watch Now</a></div></div><div class='group bg-gray-200 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105'><video class='w-full' controls><source src='video6.mp4' type='video/mp4'></video><div class='p-4'><h3 class='font-semibold text-lg'>Video Title 6</h3><p class='text-gray-700'>Brief description of video 6.</p><a href='#' class='mt-2 inline-block text-blue-600 font-semibold'>Watch Now</a></div></div><div class='group bg-gray-200 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105'><video class='w-full' controls><source src='video7.mp4' type='video/mp4'></video><div class='p-4'><h3 class='font-semibold text-lg'>Video Title 7</h3><p class='text-gray-700'>Brief description of video 7.</p><a href='#' class='mt-2 inline-block text-blue-600 font-semibold'>Watch Now</a></div></div></div></div></section>
```

## `video-showcase` / `playlist`

### Example 1: Featured Video Playlist

**When To Use**: Use this layout to highlight a curated selection of videos that are intended to engage users and drive them towards a specific action, such as subscribing or watching more content.

**Why It Works**: The layout emphasizes key videos with clear CTAs, ensuring users can easily navigate through the playlist. The use of contrasting colors and ample spacing creates a polished and intentional look.

**Tailwind Notes**:
- Utilizes flexbox for responsive grid layout.
- Incorporates hover effects to enhance interactivity.
- Employs consistent padding and margin for visual balance.

```html
<section class='py-12 bg-gray-100'>
  <div class='container mx-auto text-center'>
    <h2 class='text-3xl font-bold mb-6'>Watch Our Featured Videos</h2>
    <p class='text-lg text-gray-600 mb-12'>Explore our curated playlist to enhance your learning experience.</p>
    <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div class='bg-white rounded-lg shadow-lg overflow-hidden'>
        <video class='w-full' controls>
          <source src='video1.mp4' type='video/mp4'>
          Your browser does not support the video tag.
        </video>
        <div class='p-4'>
          <h3 class='text-xl font-semibold'>Video Title 1</h3>
          <p class='text-gray-500'>A brief description of the video content.</p>
          <a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Watch Now</a>
        </div>
      </div>
      <div class='bg-white rounded-lg shadow-lg overflow-hidden'>
        <video class='w-full' controls>
          <source src='video2.mp4' type='video/mp4'>
          Your browser does not support the video tag.
        </video>
        <div class='p-4'>
          <h3 class='text-xl font-semibold'>Video Title 2</h3>
          <p class='text-gray-500'>A brief description of the video content.</p>
          <a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Watch Now</a>
        </div>
      </div>
      <div class='bg-white rounded-lg shadow-lg overflow-hidden'>
        <video class='w-full' controls>
          <source src='video3.mp4' type='video/mp4'>
          Your browser does not support the video tag.
        </video>
        <div class='p-4'>
          <h3 class='text-xl font-semibold'>Video Title 3</h3>
          <p class='text-gray-500'>A brief description of the video content.</p>
          <a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'>Watch Now</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Interactive Video Playlist with Thumbnails

**When To Use**: Ideal for showcasing a series of related videos where thumbnails are used to entice users to click through, suitable for tutorial or educational content.

**Why It Works**: The use of thumbnails adds visual interest and helps users quickly identify content they want to watch. The responsive grid ensures a seamless experience across devices.

**Tailwind Notes**:
- Grid layout adapts to different screen sizes for optimal viewing.
- Hover effects on thumbnails encourage engagement.
- Clear hierarchy in typography guides the viewer's attention.

```html
<section class='py-16 bg-white'>
  <div class='container mx-auto text-center'>
    <h2 class='text-4xl font-bold mb-4'>Explore Our Video Series</h2>
    <p class='text-lg text-gray-700 mb-10'>Dive into our collection of insightful videos.</p>
    <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
      <div class='bg-gray-200 rounded-lg overflow-hidden transition transform hover:scale-105'>
        <img src='thumbnail1.jpg' alt='Video Thumbnail 1' class='w-full'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Video Title 1</h3>
          <a href='#' class='text-blue-600 hover:underline'>Watch Now</a>
        </div>
      </div>
      <div class='bg-gray-200 rounded-lg overflow-hidden transition transform hover:scale-105'>
        <img src='thumbnail2.jpg' alt='Video Thumbnail 2' class='w-full'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Video Title 2</h3>
          <a href='#' class='text-blue-600 hover:underline'>Watch Now</a>
        </div>
      </div>
      <div class='bg-gray-200 rounded-lg overflow-hidden transition transform hover:scale-105'>
        <img src='thumbnail3.jpg' alt='Video Thumbnail 3' class='w-full'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Video Title 3</h3>
          <a href='#' class='text-blue-600 hover:underline'>Watch Now</a>
        </div>
      </div>
      <div class='bg-gray-200 rounded-lg overflow-hidden transition transform hover:scale-105'>
        <img src='thumbnail4.jpg' alt='Video Thumbnail 4' class='w-full'>
        <div class='p-4'>
          <h3 class='text-lg font-semibold'>Video Title 4</h3>
          <a href='#' class='text-blue-600 hover:underline'>Watch Now</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

## `service-area` / `list`

### Example 1: Service Areas with Icons

**When To Use**: Use this layout to highlight different service areas with accompanying icons for visual appeal.

**Why It Works**: The use of icons enhances recognition, while the grid layout ensures clarity and easy scanning. The contrasting colors and ample white space create a polished look.

**Tailwind Notes**:
- Flexbox for responsive grid layout.
- Consistent padding and margins for spacing.
- Hover effects for interactivity.

```html
<section class='py-12 bg-gray-50'>
  <div class='container mx-auto text-center'>
    <h2 class='text-3xl font-bold mb-6'>Our Service Areas</h2>
    <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      <div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'>
        <img src='icon1.svg' alt='Service Area 1' class='w-12 h-12 mb-4 mx-auto'>
        <h3 class='text-xl font-semibold'>Area 1</h3>
        <p class='text-gray-600'>Description of service area 1.</p>
      </div>
      <div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'>
        <img src='icon2.svg' alt='Service Area 2' class='w-12 h-12 mb-4 mx-auto'>
        <h3 class='text-xl font-semibold'>Area 2</h3>
        <p class='text-gray-600'>Description of service area 2.</p>
      </div>
      <div class='bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105'>
        <img src='icon3.svg' alt='Service Area 3' class='w-12 h-12 mb-4 mx-auto'>
        <h3 class='text-xl font-semibold'>Area 3</h3>
        <p class='text-gray-600'>Description of service area 3.</p>
      </div>
    </div>
  </div>
</section>
```

### Example 2: Service Areas with Background Highlights

**When To Use**: Ideal for emphasizing specific service areas with background colors to draw attention.

**Why It Works**: The contrasting background colors for each area create a strong visual hierarchy, making it easy for users to differentiate between services. The call-to-action button encourages engagement.

**Tailwind Notes**:
- Use of background colors for emphasis.
- Responsive typography for readability.
- Clear CTA button styling.

```html
<section class='py-12'>
  <div class='container mx-auto text-center'>
    <h2 class='text-3xl font-bold mb-6'>Explore Our Service Areas</h2>
    <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div class='bg-blue-500 text-white rounded-lg p-6'>
        <h3 class='text-xl font-semibold mb-2'>Area 1</h3>
        <p class='mb-4'>Comprehensive services in this area.</p>
        <a href='#' class='bg-white text-blue-500 rounded-lg px-4 py-2 font-semibold'>Learn More</a>
      </div>
      <div class='bg-green-500 text-white rounded-lg p-6'>
        <h3 class='text-xl font-semibold mb-2'>Area 2</h3>
        <p class='mb-4'>Expert solutions tailored for you.</p>
        <a href='#' class='bg-white text-green-500 rounded-lg px-4 py-2 font-semibold'>Learn More</a>
      </div>
      <div class='bg-red-500 text-white rounded-lg p-6'>
        <h3 class='text-xl font-semibold mb-2'>Area 3</h3>
        <p class='mb-4'>Innovative approaches to your needs.</p>
        <a href='#' class='bg-white text-red-500 rounded-lg px-4 py-2 font-semibold'>Learn More</a>
      </div>
    </div>
  </div>
</section>
```

## `service-area` / `grid`

### Example 1: Service Area Grid with Icons

**When To Use**: When showcasing various services offered, each represented by an icon and brief description.

**Why It Works**: Utilizing a grid layout allows for a clean presentation of services, while icons provide quick visual cues. The use of hover effects enhances interactivity, encouraging user engagement.

**Tailwind Notes**:
- Grid layout for responsive design with 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
- Consistent spacing with 'gap-6' for even distribution
- Hover effects with 'hover:shadow-lg' to create depth

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Services</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'><div class='flex items-center justify-center mb-4'><img src='icon1.svg' alt='Service 1' class='w-12 h-12'/></div><h3 class='text-xl font-semibold mb-2'>Service One</h3><p class='text-gray-600'>Brief description of service one that highlights its benefits.</p></div><div class='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'><div class='flex items-center justify-center mb-4'><img src='icon2.svg' alt='Service 2' class='w-12 h-12'/></div><h3 class='text-xl font-semibold mb-2'>Service Two</h3><p class='text-gray-600'>Brief description of service two that highlights its benefits.</p></div><div class='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'><div class='flex items-center justify-center mb-4'><img src='icon3.svg' alt='Service 3' class='w-12 h-12'/></div><h3 class='text-xl font-semibold mb-2'>Service Three</h3><p class='text-gray-600'>Brief description of service three that highlights its benefits.</p></div></div></div></section>
```

### Example 2: Service Area Grid with Images

**When To Use**: Ideal for displaying services with accompanying images to create a more engaging visual experience.

**Why It Works**: Images enhance the appeal of services, attracting attention. The grid layout keeps the section organized, while consistent card styling maintains a professional look.

**Tailwind Notes**:
- Responsive grid with 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
- Use of 'overflow-hidden' to maintain image aspect ratios
- Text contrast with 'text-gray-800' for readability

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-10'>Explore Our Services</h2><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'><div class='bg-gray-200 rounded-lg overflow-hidden shadow-md'><img src='service1.jpg' alt='Service 1' class='w-full h-48 object-cover'/><div class='p-4'><h3 class='text-lg font-semibold'>Service One</h3><p class='text-gray-700'>Detailed description of service one.</p></div></div><div class='bg-gray-200 rounded-lg overflow-hidden shadow-md'><img src='service2.jpg' alt='Service 2' class='w-full h-48 object-cover'/><div class='p-4'><h3 class='text-lg font-semibold'>Service Two</h3><p class='text-gray-700'>Detailed description of service two.</p></div></div><div class='bg-gray-200 rounded-lg overflow-hidden shadow-md'><img src='service3.jpg' alt='Service 3' class='w-full h-48 object-cover'/><div class='p-4'><h3 class='text-lg font-semibold'>Service Three</h3><p class='text-gray-700'>Detailed description of service three.</p></div></div><div class='bg-gray-200 rounded-lg overflow-hidden shadow-md'><img src='service4.jpg' alt='Service 4' class='w-full h-48 object-cover'/><div class='p-4'><h3 class='text-lg font-semibold'>Service Four</h3><p class='text-gray-700'>Detailed description of service four.</p></div></div></div></div></section>
```

## `service-area` / `map-note`

### Example 1: Service Areas Overview with Map

**When To Use**: Use this layout to highlight specific service areas alongside a visual map representation, perfect for local businesses.

**Why It Works**: The combination of a clear map and well-defined service area cards creates a visually appealing and informative section that guides users directly to relevant information. The use of contrasting colors ensures the CTA stands out.

**Tailwind Notes**:
- Flexbox is utilized for responsive layout adjustments.
- Spacing is carefully controlled to maintain a clean look.
- Hover effects on service area cards enhance interactivity.

```html
<section class='py-16 bg-gray-50'><div class='container mx-auto flex flex-col lg:flex-row items-start'><div class='w-full lg:w-2/3'><h2 class='text-3xl font-bold mb-4'>Our Service Areas</h2><p class='text-lg text-gray-700 mb-6'>We proudly serve the following areas:</p><div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow'><h3 class='text-xl font-semibold mb-2'>Downtown</h3><p class='text-gray-600'>Comprehensive services available.</p></div><div class='bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow'><h3 class='text-xl font-semibold mb-2'>Uptown</h3><p class='text-gray-600'>Expert solutions tailored for you.</p></div><div class='bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow'><h3 class='text-xl font-semibold mb-2'>Suburbs</h3><p class='text-gray-600'>Reliable support in your neighborhood.</p></div></div></div><div class='w-full lg:w-1/3 lg:pl-6'><img src='map-image.jpg' alt='Service Area Map' class='w-full h-auto rounded-lg shadow-lg' /></div></div><div class='text-center mt-10'><a href='#contact' class='bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition'>Get in Touch</a></div></section>
```

### Example 2: Interactive Service Area Map with Highlights

**When To Use**: Ideal for companies that want to showcase an interactive map with highlighted service areas, enhancing user engagement.

**Why It Works**: The use of an interactive map alongside highlighted areas creates an engaging experience. Clear typography and ample spacing ensure readability, while the CTA is prominently displayed to encourage action.

**Tailwind Notes**:
- Responsive design ensures usability across devices.
- Hover states on the map enhance user interaction.
- Consistent color schemes maintain brand identity.

```html
<section class='py-16 bg-white'><div class='container mx-auto'><h2 class='text-4xl font-bold text-center mb-8'>Explore Our Service Areas</h2><div class='flex flex-col lg:flex-row justify-between items-center'><div class='lg:w-2/3'><img src='interactive-map.jpg' alt='Interactive Service Area Map' class='w-full h-auto rounded-lg shadow-md' /></div><div class='lg:w-1/3 lg:pl-8'><h3 class='text-2xl font-semibold mb-4'>Service Areas</h3><ul class='space-y-4'><li class='bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition'>Downtown</li><li class='bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition'>Uptown</li><li class='bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition'>Suburbs</li></ul></div></div><div class='text-center mt-10'><a href='#services' class='bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition'>See Our Services</a></div></div></section>
```

## `service-area` / `city-groups`

### Example 1: City Groups Overview with Cards

**When To Use**: When showcasing multiple service areas in a visually engaging card format, ideal for a marketing site targeting different cities.

**Why It Works**: The card layout allows for a clear presentation of each city, enhancing readability and encouraging user interaction. The use of hover effects and clear CTAs invites users to explore further.

**Tailwind Notes**:
- Utilizes grid layout for responsiveness and alignment.
- Hover effects on cards improve interactivity.
- Consistent spacing ensures a tidy appearance.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Service Areas</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105'><img src='city1.jpg' alt='City 1' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>City 1</h3><p class='text-gray-600 mb-4'>Description of services offered in City 1.</p><a href='/city1' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div><div class='bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105'><img src='city2.jpg' alt='City 2' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>City 2</h3><p class='text-gray-600 mb-4'>Description of services offered in City 2.</p><a href='/city2' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div><div class='bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105'><img src='city3.jpg' alt='City 3' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold mb-2'>City 3</h3><p class='text-gray-600 mb-4'>Description of services offered in City 3.</p><a href='/city3' class='inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div></div></div></section>
```

### Example 2: City Groups List with Emphasis on CTA

**When To Use**: When a straightforward list format is preferred, emphasizing the call to action for each city, suitable for a more text-heavy site.

**Why It Works**: The list format provides clear, direct access to each service area, while the prominent CTA buttons ensure users know where to go next. The use of alternating background colors improves readability.

**Tailwind Notes**:
- Alternating background colors enhance visual interest.
- Large CTA buttons create a strong visual target.
- Generous padding and margins improve touch targets for mobile users.

```html
<section class='py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Explore Our Service Areas</h2><ul class='space-y-6'><li class='bg-gray-100 p-6 rounded-lg'><h3 class='text-xl font-semibold'>City 1</h3><p class='text-gray-600'>Description of services offered in City 1.</p><a href='/city1' class='mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></li><li class='bg-white p-6 rounded-lg'><h3 class='text-xl font-semibold'>City 2</h3><p class='text-gray-600'>Description of services offered in City 2.</p><a href='/city2' class='mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></li><li class='bg-gray-100 p-6 rounded-lg'><h3 class='text-xl font-semibold'>City 3</h3><p class='text-gray-600'>Description of services offered in City 3.</p><a href='/city3' class='mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></li></ul></div></section>
```

## `locations` / `cards`

### Example 1: Grid of Location Cards

**When To Use**: Use this layout when showcasing multiple locations with key details, ideal for a landing page.

**Why It Works**: The grid layout allows for a clean presentation of multiple locations, while the card design provides clear separation and emphasis on each location. The use of hover effects enhances interactivity.

**Tailwind Notes**:
- Grid layout for responsive design using grid-cols-1, md:grid-cols-2, lg:grid-cols-3.
- Consistent spacing with gap-6 for card separation.
- Hover effects for cards using transition and transform classes.

```html
<section class='py-12 bg-gray-50'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Locations</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'><img src='location1.jpg' alt='Location 1' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold'>Location 1</h3><p class='text-gray-600'>123 Main St, City, State</p><a href='#' class='mt-4 inline-block text-blue-500 font-semibold hover:underline'>View Details</a></div></div><div class='bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'><img src='location2.jpg' alt='Location 2' class='w-full h-48 object-cover'><div class='p-6'><h3 class='text-xl font-semibold'>Location 2</h3><p class='text-gray-600'>456 Elm St, City, State</p><a href='#' class='mt-4 inline-block text-blue-500 font-semibold hover:underline'>View Details</a></div></div></div></div></section>
```

### Example 2: Single Location Highlight Card

**When To Use**: Ideal for featuring a flagship location or a special offer at a specific location.

**Why It Works**: The single card layout draws attention to one specific location, making it perfect for promotional purposes. The use of background colors and bold typography enhances visibility.

**Tailwind Notes**:
- Full-width layout for emphasis using w-full.
- Increased padding and margin for focus on the card.
- Bold typography with larger font sizes for headings.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Featured Location</h2><div class='bg-blue-500 text-white rounded-lg overflow-hidden shadow-lg'><img src='featured_location.jpg' alt='Featured Location' class='w-full h-64 object-cover'><div class='p-8'><h3 class='text-2xl font-semibold'>Flagship Store</h3><p class='text-lg'>789 Oak St, City, State</p><p class='mt-4'>Visit us for exclusive offers and events!</p><a href='#' class='mt-6 inline-block bg-white text-blue-500 font-semibold rounded-full py-2 px-6 hover:bg-gray-200 transition'>Get Directions</a></div></div></div></section>
```

## `locations` / `map`

### Example 1: Interactive Store Locator

**When To Use**: When you want to allow users to find physical locations easily with an interactive map.

**Why It Works**: This layout utilizes a full-width map alongside a list of locations, providing a clear visual hierarchy and easy access to information. The use of contrasting colors for the CTA makes it stand out.

**Tailwind Notes**:
- Flexbox layout for responsive design.
- Full-width map for immersive experience.
- Consistent spacing and typography for clarity.

```html
<section class='flex flex-col md:flex-row bg-gray-50 p-8'>
  <div class='md:w-1/2'>
    <h2 class='text-2xl font-bold mb-4'>Find Our Locations</h2>
    <ul class='space-y-4'>
      <li class='bg-white shadow-md rounded-lg p-4'>
        <h3 class='text-lg font-semibold'>Store 1</h3>
        <p class='text-gray-600'>123 Main St, City, State</p>
        <a href='#' class='text-blue-500 hover:underline'>View on Map</a>
      </li>
      <li class='bg-white shadow-md rounded-lg p-4'>
        <h3 class='text-lg font-semibold'>Store 2</h3>
        <p class='text-gray-600'>456 Elm St, City, State</p>
        <a href='#' class='text-blue-500 hover:underline'>View on Map</a>
      </li>
    </ul>
  </div>
  <div class='md:w-1/2'>
    <div class='w-full h-64 bg-gray-300 rounded-lg'>
      <!-- Replace with an interactive map component -->
    </div>
  </div>
</section>
```

### Example 2: Location Highlights with Map

**When To Use**: When you want to showcase key locations with accompanying images and descriptions on a marketing site.

**Why It Works**: Combining images with location details creates an engaging visual experience. The layout is responsive, ensuring a good user experience on mobile devices. The CTA buttons are prominently placed for easy access.

**Tailwind Notes**:
- Grid layout for responsive design.
- Utilizes images to enhance engagement.
- Clear CTA buttons for user action.

```html
<section class='p-8 bg-white'>
  <h2 class='text-3xl font-bold text-center mb-6'>Explore Our Locations</h2>
  <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
    <div class='bg-gray-100 rounded-lg shadow-lg overflow-hidden'>
      <img src='location1.jpg' alt='Store 1' class='w-full h-40 object-cover'>
      <div class='p-4'>
        <h3 class='text-xl font-semibold'>Store 1</h3>
        <p class='text-gray-600'>Located in the heart of downtown.</p>
        <a href='#' class='mt-2 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Visit Us</a>
      </div>
    </div>
    <div class='bg-gray-100 rounded-lg shadow-lg overflow-hidden'>
      <img src='location2.jpg' alt='Store 2' class='w-full h-40 object-cover'>
      <div class='p-4'>
        <h3 class='text-xl font-semibold'>Store 2</h3>
        <p class='text-gray-600'>Your favorite products are just around the corner.</p>
        <a href='#' class='mt-2 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700'>Visit Us</a>
      </div>
    </div>
  </div>
</section>
```

## `locations` / `branches`

### Example 1: Branch Locations Grid

**When To Use**: Use this layout to showcase multiple branch locations in a visually appealing grid format, ideal for marketing sites that want to highlight accessibility.

**Why It Works**: The grid layout allows for clear visibility of each branch, with sufficient spacing and consistent card designs that enhance readability. The use of hover effects adds interactivity, while the prominent call-to-action encourages user engagement.

**Tailwind Notes**:
- Grid layout for responsive design using 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' for varying screen sizes.
- Consistent card styling with 'bg-white shadow-md rounded-lg' for a polished look.
- Hover effect with 'hover:shadow-lg' to enhance interactivity.

```html
<section class='py-12 bg-gray-100'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Our Branch Locations</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'><div class='bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow'><h3 class='text-xl font-semibold'>Branch A</h3><p class='text-gray-600'>123 Main St, City, State</p><a href='#' class='mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Visit Us</a></div><div class='bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow'><h3 class='text-xl font-semibold'>Branch B</h3><p class='text-gray-600'>456 Elm St, City, State</p><a href='#' class='mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Visit Us</a></div><div class='bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow'><h3 class='text-xl font-semibold'>Branch C</h3><p class='text-gray-600'>789 Oak St, City, State</p><a href='#' class='mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Visit Us</a></div></div></div></section>
```

### Example 2: Branch Locations List with Map Integration

**When To Use**: Ideal for sites that want to provide detailed information about each branch along with a visual map representation, enhancing user experience and accessibility.

**Why It Works**: The list format allows for detailed descriptions and easy scanning of branch information. The integration of a map image adds a visual context that enhances user navigation. The clear CTAs guide users to take action.

**Tailwind Notes**:
- Use flexbox for layout with 'flex flex-col lg:flex-row' to accommodate both text and map side by side.
- Consistent typography with 'text-lg font-medium' for branch names and 'text-gray-500' for addresses.
- Map image styled with 'rounded-lg shadow-lg' to maintain consistency with the branch cards.

```html
<section class='py-12'><div class='container mx-auto'><h2 class='text-3xl font-bold text-center mb-8'>Find Our Branches</h2><div class='flex flex-col lg:flex-row gap-8'><div class='flex-1'><ul class='space-y-4'><li class='bg-white p-4 rounded-lg shadow-md'><h3 class='text-lg font-medium'>Branch D</h3><p class='text-gray-500'>321 Pine St, City, State</p><a href='#' class='mt-2 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Visit Us</a></li><li class='bg-white p-4 rounded-lg shadow-md'><h3 class='text-lg font-medium'>Branch E</h3><p class='text-gray-500'>654 Maple St, City, State</p><a href='#' class='mt-2 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Visit Us</a></li></ul></div><div class='flex-1'><img src='map-placeholder.jpg' alt='Map of Branch Locations' class='rounded-lg shadow-lg' /></div></div></div></section>
```

## `footer` / `simple`

### Example 1: Minimalistic Company Footer

**When To Use**: Use this footer layout for a clean and modern look, suitable for tech or startup websites.

**Why It Works**: The layout emphasizes the company name and tagline while providing clear navigation links in a structured format. The use of responsive design ensures it looks great on all devices.

**Tailwind Notes**:
- Utilizes flexbox for layout management, ensuring items are evenly spaced.
- Incorporates responsive padding and margin for better spacing on different screen sizes.
- Uses contrasting colors for text and background to enhance readability.

```html
<footer class='bg-gray-800 text-white py-8'><div class='container mx-auto flex flex-col md:flex-row justify-between'><div class='mb-4 md:mb-0'><h2 class='text-2xl font-bold'>Company Name</h2><p class='text-gray-400'>Your tagline here</p></div><nav class='flex flex-col md:flex-row space-x-0 md:space-x-8'><a href='#' class='text-gray-300 hover:text-white'>Home</a><a href='#' class='text-gray-300 hover:text-white'>About</a><a href='#' class='text-gray-300 hover:text-white'>Services</a><a href='#' class='text-gray-300 hover:text-white'>Contact</a></nav></div><div class='border-t border-gray-700 mt-6 pt-4'><p class='text-center text-gray-500'>&copy; 2023 Company Name. All rights reserved.</p></div></footer>
```

### Example 2: Structured Multi-Column Footer

**When To Use**: Ideal for larger companies with multiple service offerings or resources to highlight.

**Why It Works**: This footer layout provides a structured way to display links and information in a grid format, making it easy for users to find what they need. The use of distinct columns helps in organizing content effectively.

**Tailwind Notes**:
- Employs grid layout for clear organization of content across multiple columns.
- Uses consistent spacing and typography for a unified look.
- Incorporates hover effects for links to enhance interactivity.

```html
<footer class='bg-gray-900 text-white py-10'><div class='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'><div><h3 class='text-lg font-semibold mb-2'>Company</h3><ul><li><a href='#' class='text-gray-300 hover:text-white'>About Us</a></li><li><a href='#' class='text-gray-300 hover:text-white'>Careers</a></li><li><a href='#' class='text-gray-300 hover:text-white'>Privacy Policy</a></li></ul></div><div><h3 class='text-lg font-semibold mb-2'>Services</h3><ul><li><a href='#' class='text-gray-300 hover:text-white'>Web Development</a></li><li><a href='#' class='text-gray-300 hover:text-white'>SEO Services</a></li><li><a href='#' class='text-gray-300 hover:text-white'>Marketing</a></li></ul></div><div><h3 class='text-lg font-semibold mb-2'>Contact</h3><ul><li><a href='#' class='text-gray-300 hover:text-white'>Support</a></li><li><a href='#' class='text-gray-300 hover:text-white'>Email Us</a></li><li><a href='#' class='text-gray-300 hover:text-white'>Locations</a></li></ul></div></div><div class='border-t border-gray-700 mt-6 pt-4'><p class='text-center text-gray-500'>&copy; 2023 Company Name. All rights reserved.</p></div></footer>
```

## `footer` / `multi-column`

### Example 1: Standard Multi-Column Footer

**When To Use**: Use this example for a straightforward footer that includes company information, navigation links, and social media icons.

**Why It Works**: The layout is clean and organized, providing clear navigation and branding. The use of contrasting colors helps important information stand out, while responsive design ensures usability on all devices.

**Tailwind Notes**:
- Utilizes flexbox for responsive column layout.
- Employs spacing utilities for consistent padding and margins.
- Effective use of text color and hover effects for links.

```html
<footer class='bg-gray-800 text-white py-10'><div class='container mx-auto flex flex-wrap justify-between'><div class='w-full md:w-1/3 mb-6'><h4 class='text-lg font-semibold mb-2'>Company Name</h4><p class='text-sm'>Tagline goes here</p></div><div class='w-full md:w-1/3 mb-6'><h4 class='text-lg font-semibold mb-2'>Navigation</h4><ul class='text-sm'><li><a href='#' class='hover:underline'>Home</a></li><li><a href='#' class='hover:underline'>About Us</a></li><li><a href='#' class='hover:underline'>Services</a></li><li><a href='#' class='hover:underline'>Contact</a></li></ul></div><div class='w-full md:w-1/3 mb-6'><h4 class='text-lg font-semibold mb-2'>Follow Us</h4><div class='flex space-x-4'><a href='#' class='hover:text-gray-400'><i class='fab fa-facebook'></i></a><a href='#' class='hover:text-gray-400'><i class='fab fa-twitter'></i></a><a href='#' class='hover:text-gray-400'><i class='fab fa-instagram'></i></a></div></div></div><div class='text-center text-sm mt-6'>© 2023 Company Name. All rights reserved.</div></footer>
```

### Example 2: Enhanced Multi-Column Footer with Call to Action

**When To Use**: Use this footer variant when you want to encourage user engagement with a prominent call to action.

**Why It Works**: The call to action is visually distinct and draws attention, while the structured layout allows for easy navigation. The use of background colors and spacing creates a polished look that enhances user experience.

**Tailwind Notes**:
- Incorporates a CTA button with emphasis using background color and hover effects.
- Maintains consistent typography for readability.
- Responsive design ensures that the footer adapts well on smaller screens.

```html
<footer class='bg-gray-900 text-white py-10'><div class='container mx-auto flex flex-col md:flex-row justify-between'><div class='mb-6'><h4 class='text-lg font-semibold mb-2'>Company Name</h4><p class='text-sm'>Your trusted partner for quality services.</p></div><div class='mb-6'><h4 class='text-lg font-semibold mb-2'>Quick Links</h4><ul class='text-sm'><li><a href='#' class='hover:underline'>Home</a></li><li><a href='#' class='hover:underline'>Products</a></li><li><a href='#' class='hover:underline'>Blog</a></li><li><a href='#' class='hover:underline'>Support</a></li></ul></div><div class='mb-6'><h4 class='text-lg font-semibold mb-2'>Newsletter Signup</h4><p class='text-sm'>Stay updated with our latest news.</p><form class='flex mt-2'><input type='email' placeholder='Your email' class='py-2 px-4 rounded-l-md border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500' /><button type='submit' class='bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700'>Subscribe</button></form></div></div><div class='text-center text-sm mt-6'>© 2023 Company Name. All rights reserved.</div></footer>
```

## `footer` / `legal-heavy`

### Example 1: Simple Legal Footer with Company Info

**When To Use**: Use this layout for a straightforward footer that emphasizes company information and legal links.

**Why It Works**: The clear hierarchy created by headings and spacing helps users navigate legal information easily. The use of contrasting colors for links ensures they are noticeable without overwhelming the user.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs consistent padding and margins for a polished look.
- Color contrast for links ensures accessibility.

```html
<footer class='bg-gray-800 text-white py-8'><div class='container mx-auto flex flex-col md:flex-row justify-between'><div><h2 class='text-lg font-bold'>Company Name</h2><p class='text-sm italic'>Your trusted tagline goes here.</p></div><div class='flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0'><a href='#' class='text-gray-400 hover:text-white'>Privacy Policy</a><a href='#' class='text-gray-400 hover:text-white'>Terms of Service</a><a href='#' class='text-gray-400 hover:text-white'>Contact Us</a></div></div><div class='text-center mt-4 text-sm'>© 2023 Company Name. All rights reserved.</div></footer>
```

### Example 2: Grid Layout Legal Footer with Multiple Links

**When To Use**: Ideal for companies that require a more comprehensive footer with multiple legal sections and links.

**Why It Works**: The grid layout organizes information clearly and allows users to scan for relevant links quickly. The use of hover effects on links enhances interactivity, while the structured layout maintains a clean aesthetic.

**Tailwind Notes**:
- Grid layout provides a clean organization of links.
- Hover effects enhance user engagement.
- Consistent typography improves readability.

```html
<footer class='bg-gray-900 text-gray-200 py-10'><div class='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'><div><h2 class='text-lg font-bold'>Company Name</h2><p class='text-sm italic'>Your trusted tagline goes here.</p></div><div class='flex flex-col'><h3 class='font-semibold'>Legal</h3><a href='#' class='mt-2 hover:text-white'>Privacy Policy</a><a href='#' class='mt-2 hover:text-white'>Terms of Service</a><a href='#' class='mt-2 hover:text-white'>Cookie Policy</a></div><div class='flex flex-col'><h3 class='font-semibold'>Support</h3><a href='#' class='mt-2 hover:text-white'>Help Center</a><a href='#' class='mt-2 hover:text-white'>Contact Us</a><a href='#' class='mt-2 hover:text-white'>Feedback</a></div></div><div class='text-center mt-8 text-sm'>© 2023 Company Name. All rights reserved.</div></footer>
```

### Example 3: Multi-Column Legal Footer with Emphasized CTA

**When To Use**: Best for companies that want to highlight a call to action alongside legal information.

**Why It Works**: The multi-column layout allows for a clear separation of legal content and promotional material. The emphasized CTA button draws attention and encourages user engagement, while the subdued legal links maintain a professional tone.

**Tailwind Notes**:
- Flexbox layout ensures responsiveness.
- CTA button is styled for prominence.
- Subtle colors for legal links maintain professionalism.

```html
<footer class='bg-gray-800 text-white py-12'><div class='container mx-auto flex flex-col md:flex-row justify-between'><div class='flex-1'><h2 class='text-lg font-bold'>Company Name</h2><p class='text-sm italic'>Your trusted tagline goes here.</p></div><div class='flex-1 flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0'><a href='#' class='text-gray-400 hover:text-white'>Privacy Policy</a><a href='#' class='text-gray-400 hover:text-white'>Terms of Service</a><a href='#' class='text-gray-400 hover:text-white'>Legal Notices</a></div><div class='flex-1 mt-4 md:mt-0'><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Get Support</a></div></div><div class='text-center mt-6 text-sm'>© 2023 Company Name. All rights reserved.</div></footer>
```

## `footer` / `sitemap`

### Example 1: Simple Sitemap with Clear Hierarchy

**When To Use**: When you want to provide a straightforward sitemap that emphasizes clear navigation and company branding.

**Why It Works**: This design uses a grid layout to create a clear hierarchy of links, with emphasis on the company name and tagline. The use of contrasting colors for text and background enhances readability.

**Tailwind Notes**:
- Uses grid layout for responsive columns.
- Emphasizes company branding with larger text.
- Maintains good spacing for readability.

```html
<footer class="bg-gray-800 text-white py-10">
  <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    <div>
      <h2 class="text-2xl font-bold mb-2">Company Name</h2>
      <p class="text-sm mb-4">Your tagline goes here.</p>
      <p class="text-xs">© 2023 Company Name. All rights reserved.</p>
    </div>
    <div>
      <h3 class="font-semibold mb-2">Products</h3>
      <ul class="space-y-1 text-sm">
        <li><a href="#" class="hover:underline">Product 1</a></li>
        <li><a href="#" class="hover:underline">Product 2</a></li>
        <li><a href="#" class="hover:underline">Product 3</a></li>
      </ul>
    </div>
    <div>
      <h3 class="font-semibold mb-2">Resources</h3>
      <ul class="space-y-1 text-sm">
        <li><a href="#" class="hover:underline">Blog</a></li>
        <li><a href="#" class="hover:underline">Help Center</a></li>
        <li><a href="#" class="hover:underline">Contact Us</a></li>
      </ul>
    </div>
  </div>
</footer>
```

### Example 2: Sitemap with Emphasized Call to Action

**When To Use**: When you want to encourage user engagement and provide a clear navigation path while promoting a specific action.

**Why It Works**: The design includes a prominent call-to-action button that stands out against the footer background. The use of contrasting colors and ample whitespace directs users' attention effectively.

**Tailwind Notes**:
- Incorporates a button for engagement.
- Utilizes color contrast for visibility.
- Responsive design ensures usability on all devices.

```html
<footer class="bg-gray-900 text-white py-12">
  <div class="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
    <div class="col-span-1">
      <h2 class="text-3xl font-bold mb-2">Company Name</h2>
      <p class="text-sm mb-4">Your tagline goes here.</p>
      <p class="text-xs">© 2023 Company Name. All rights reserved.</p>
    </div>
    <div class="col-span-1">
      <h3 class="font-semibold mb-2">Services</h3>
      <ul class="space-y-1 text-sm">
        <li><a href="#" class="hover:underline">Service 1</a></li>
        <li><a href="#" class="hover:underline">Service 2</a></li>
        <li><a href="#" class="hover:underline">Service 3</a></li>
      </ul>
    </div>
    <div class="col-span-1">
      <h3 class="font-semibold mb-2">Company</h3>
      <ul class="space-y-1 text-sm">
        <li><a href="#" class="hover:underline">About Us</a></li>
        <li><a href="#" class="hover:underline">Careers</a></li>
        <li><a href="#" class="hover:underline">Privacy Policy</a></li>
      </ul>
    </div>
    <div class="col-span-1 flex flex-col justify-center items-start">
      <h3 class="font-semibold mb-2">Get Started</h3>
      <a href="#" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Sign Up Now</a>
    </div>
  </div>
</footer>
```

## `footer` / `contact-heavy`

### Example 1: Simple Contact Footer

**When To Use**: Use this layout for a straightforward footer with essential contact information and a clear call to action.

**Why It Works**: The layout uses clear hierarchy and spacing to guide the user’s eye towards the contact information and CTA, ensuring that the most important elements stand out.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Emphasizes contrast with background and text colors.
- Adequate padding and margin for a clean look.

```html
<footer class='bg-gray-800 text-white py-10'><div class='container mx-auto flex flex-col md:flex-row justify-between'><div class='mb-6 md:mb-0'><h2 class='text-lg font-semibold'>Company Name</h2><p class='text-sm'>Your trusted partner in business.</p></div><div class='flex flex-col'><h3 class='font-semibold'>Contact Us</h3><p class='text-sm'>Email: info@company.com</p><p class='text-sm'>Phone: (123) 456-7890</p></div><div class='mt-4 md:mt-0'><a href='/contact' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200'>Get in Touch</a></div></div><div class='text-center mt-6 text-gray-400'>&copy; 2023 Company Name. All rights reserved.</div></footer>
```

### Example 2: Multi-Column Contact Footer

**When To Use**: Ideal for businesses that want to provide multiple contact options and additional links in a structured manner.

**Why It Works**: The use of columns allows for organized presentation of information, making it easy for users to find what they need. The clear separation of sections enhances readability.

**Tailwind Notes**:
- Grid layout for responsive columns.
- Consistent spacing and alignment for a cohesive look.
- Hover effects on links for better interactivity.

```html
<footer class='bg-gray-900 text-white py-10'><div class='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'><div><h2 class='text-lg font-semibold'>Company Name</h2><p class='text-sm'>Connecting you to the future.</p></div><div><h3 class='font-semibold'>Contact Information</h3><p class='text-sm'>Email: support@company.com</p><p class='text-sm'>Phone: (123) 456-7890</p></div><div><h3 class='font-semibold'>Follow Us</h3><div class='flex space-x-4'><a href='#' class='text-blue-400 hover:text-blue-500'>Facebook</a><a href='#' class='text-blue-400 hover:text-blue-500'>Twitter</a><a href='#' class='text-blue-400 hover:text-blue-500'>LinkedIn</a></div></div></div><div class='text-center mt-6 text-gray-400'>&copy; 2023 Company Name. All rights reserved.</div></footer>
```

## `footer` / `social-heavy`

### Example 1: Minimalist Social Footer

**When To Use**: Use this design for a clean, modern look that emphasizes social media connections.

**Why It Works**: The minimalist design allows for easy navigation while emphasizing the brand's social presence. The use of contrasting colors for the CTA buttons ensures they stand out.

**Tailwind Notes**:
- Flexbox layout for even distribution of items.
- Responsive typography for better readability.
- Hover effects on social icons for interactivity.

```html
<footer class='bg-gray-800 text-white py-8'><div class='container mx-auto flex flex-col md:flex-row justify-between items-center'><div class='text-center md:text-left'><h2 class='text-lg font-bold'>Company Name</h2><p class='text-sm'>Your tagline goes here.</p></div><div class='flex space-x-4 mt-4 md:mt-0'><a href='#' class='text-gray-400 hover:text-white transition'><i class='fab fa-facebook'></i></a><a href='#' class='text-gray-400 hover:text-white transition'><i class='fab fa-twitter'></i></a><a href='#' class='text-gray-400 hover:text-white transition'><i class='fab fa-instagram'></i></a></div></div><div class='text-center mt-4'><p class='text-sm'>&copy; 2023 Company Name. All rights reserved.</p></div></footer>
```

### Example 2: Grid-Based Social Footer

**When To Use**: Ideal for brands with multiple social platforms and a desire to showcase additional links or content.

**Why It Works**: This layout utilizes a grid to create a structured and organized appearance, making it easy for users to find links. The use of ample spacing enhances readability and accessibility.

**Tailwind Notes**:
- Grid layout for responsive arrangement of items.
- Consistent padding and margins for a polished look.
- Clear hierarchy with larger text for the company name.

```html
<footer class='bg-gray-900 text-white py-12'><div class='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'><div class='text-center md:text-left'><h2 class='text-xl font-semibold'>Company Name</h2><p class='text-sm'>Your tagline here.</p></div><div class='flex flex-col items-center md:items-start'><h3 class='font-medium'>Follow Us</h3><div class='flex space-x-4 mt-2'><a href='#' class='text-gray-400 hover:text-white transition'><i class='fab fa-facebook'></i></a><a href='#' class='text-gray-400 hover:text-white transition'><i class='fab fa-twitter'></i></a><a href='#' class='text-gray-400 hover:text-white transition'><i class='fab fa-instagram'></i></a></div></div><div class='text-center md:text-right'><p class='text-sm'>&copy; 2023 Company Name. All rights reserved.</p></div></div></footer>
```

### Example 3: CTA-Focused Social Footer

**When To Use**: Best for sites that want to drive social engagement and provide a clear call to action.

**Why It Works**: This design incorporates a prominent CTA button alongside social links, encouraging user interaction. The contrasting colors and larger button size draw attention, while the layout remains clean and organized.

**Tailwind Notes**:
- Use of a button to create a strong call to action.
- Contrast between background and text for visibility.
- Flexbox for alignment and distribution of elements.

```html
<footer class='bg-gray-800 text-white py-10'><div class='container mx-auto flex flex-col md:flex-row justify-between items-center'><div class='text-center md:text-left'><h2 class='text-lg font-bold'>Company Name</h2><p class='text-sm'>Your tagline goes here.</p></div><div class='flex space-x-4 mt-4 md:mt-0'><a href='#' class='text-gray-400 hover:text-white transition'><i class='fab fa-facebook'></i></a><a href='#' class='text-gray-400 hover:text-white transition'><i class='fab fa-twitter'></i></a><a href='#' class='text-gray-400 hover:text-white transition'><i class='fab fa-instagram'></i></a></div></div><div class='text-center mt-6'><a href='#' class='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition'>Join Us</a></div><div class='text-center mt-4'><p class='text-sm'>&copy; 2023 Company Name. All rights reserved.</p></div></footer>
```

## `footer` / `newsletter`

### Example 1: Simple Newsletter Signup

**When To Use**: Use this layout for a straightforward newsletter signup section that emphasizes the call-to-action.

**Why It Works**: The clear hierarchy and ample spacing draw attention to the signup form, while the contrasting colors enhance readability and engagement.

**Tailwind Notes**:
- The use of bg-gray-800 provides a strong backdrop that makes the text pop.
- Text colors and spacing ensure that the section is easy to read and visually appealing.

```html
<footer class='bg-gray-800 text-white py-12'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold mb-4'>Stay Updated!</h2><p class='mb-6'>Subscribe to our newsletter for the latest updates and offers.</p><form class='flex flex-col md:flex-row md:items-center'><input type='email' placeholder='Your email address' class='flex-1 p-3 mb-4 md:mb-0 md:mr-4 rounded bg-gray-700 text-white placeholder-gray-400' required /><button type='submit' class='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded'>Subscribe</button></form><div class='mt-6 text-sm'>© 2023 Your Company Name. All rights reserved.</div></div></footer>
```

### Example 2: Newsletter with Company Tagline

**When To Use**: Ideal for a brand-focused newsletter section that incorporates a tagline to reinforce brand identity.

**Why It Works**: This design effectively combines brand messaging with a clear call-to-action, ensuring users understand the value of subscribing.

**Tailwind Notes**:
- The tagline is styled with a lighter font weight to differentiate it from the main heading.
- Responsive flex layout allows the form to stack on smaller screens.

```html
<footer class='bg-white border-t border-gray-200 py-12'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-gray-800 mb-2'>Join Our Newsletter</h2><p class='text-gray-600 mb-6'>Your Company Tagline Here</p><form class='flex flex-col md:flex-row md:items-center'><input type='email' placeholder='Enter your email' class='flex-1 p-3 mb-4 md:mb-0 md:mr-4 border border-gray-300 rounded' required /><button type='submit' class='bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded'>Subscribe Now</button></form><div class='mt-6 text-sm text-gray-500'>© 2023 Your Company Name. All rights reserved.</div></div></footer>
```

### Example 3: Multi-Column Newsletter Section

**When To Use**: Use this layout for a more complex newsletter section that includes multiple columns for additional information or resources.

**Why It Works**: The grid layout allows for organized content presentation, making it easy for users to digest multiple pieces of information while maintaining focus on the newsletter signup.

**Tailwind Notes**:
- The grid system ensures that the layout is responsive and adjusts seamlessly across devices.
- Using different background colors for each column adds visual interest without overwhelming the user.

```html
<footer class='bg-gray-100 py-12'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-gray-800 mb-6 text-center'>Subscribe for Updates</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='bg-white p-6 rounded shadow'><h3 class='font-semibold text-lg'>Latest News</h3><p class='text-gray-600'>Stay informed about our latest products and services.</p></div><div class='bg-white p-6 rounded shadow'><h3 class='font-semibold text-lg'>Exclusive Offers</h3><p class='text-gray-600'>Get exclusive deals and discounts directly to your inbox.</p></div><div class='bg-white p-6 rounded shadow'><h3 class='font-semibold text-lg'>Join Our Community</h3><p class='text-gray-600'>Be part of our growing community and connect with others.</p></div></div><form class='flex flex-col md:flex-row md:items-center mt-6'><input type='email' placeholder='Your email address' class='flex-1 p-3 mb-4 md:mb-0 md:mr-4 border border-gray-300 rounded' required /><button type='submit' class='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded'>Subscribe</button></form><div class='mt-6 text-sm text-gray-500 text-center'>© 2023 Your Company Name. All rights reserved.</div></div></footer>
```

## `footer` / `location`

### Example 1: Modern Urban Footer

**When To Use**: Use this layout for a contemporary business that wants to emphasize its urban presence and accessibility.

**Why It Works**: The use of contrasting colors, clear typography, and well-defined sections enhances readability and draws attention to the company's information and CTA.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs spacing utilities for clear separation of content.
- Incorporates hover effects for interactive elements.

```html
<footer class='bg-gray-800 text-white py-10'><div class='container mx-auto flex flex-col md:flex-row justify-between'><div class='mb-6 md:mb-0'><h2 class='text-xl font-bold'>Company Name</h2><p class='text-gray-400'>Your trusted partner in urban living.</p></div><div class='grid grid-cols-2 md:grid-cols-3 gap-6'><div><h3 class='font-semibold'>Locations</h3><ul class='text-gray-300'><li>New York</li><li>San Francisco</li><li>Chicago</li></ul></div><div><h3 class='font-semibold'>Services</h3><ul class='text-gray-300'><li>Consulting</li><li>Design</li><li>Development</li></ul></div><div><h3 class='font-semibold'>Contact</h3><ul class='text-gray-300'><li>Email</li><li>Phone</li><li>Social Media</li></ul></div></div></div><div class='text-center mt-10'><p class='text-gray-500'>&copy; 2023 Company Name. All rights reserved.</p></div></footer>
```

### Example 2: Elegant Minimalist Footer

**When To Use**: Ideal for brands that want to convey sophistication with a clean and minimal aesthetic.

**Why It Works**: The use of ample white space, simple typography, and a limited color palette creates an elegant look that is easy to navigate.

**Tailwind Notes**:
- Focuses on whitespace to enhance clarity.
- Subtle hover effects improve user engagement.
- Flexible grid layout adapts well on all devices.

```html
<footer class='bg-white text-gray-800 py-12'><div class='container mx-auto flex flex-col md:flex-row justify-between'><div class='mb-8 md:mb-0'><h2 class='text-2xl font-semibold'>Company Name</h2><p class='text-gray-600'>Innovating your world.</p></div><div class='grid grid-cols-1 md:grid-cols-2 gap-8'><div><h3 class='font-medium'>Our Locations</h3><ul class='list-disc list-inside'><li>Los Angeles</li><li>Miami</li><li>Seattle</li></ul></div><div><h3 class='font-medium'>Get in Touch</h3><ul class='list-disc list-inside'><li>Email Us</li><li>Call Us</li><li>Follow Us</li></ul></div></div></div><div class='text-center mt-8'><p class='text-gray-500'>&copy; 2023 Company Name. All rights reserved.</p></div></footer>
```

## `footer` / `minimal-brand`

### Example 1: Simple Brand Footer

**When To Use**: Use this footer for a clean and straightforward presentation of your brand, suitable for any landing page.

**Why It Works**: The use of a dark background with light text creates strong contrast, ensuring readability. The layout is responsive and maintains a clear hierarchy, with the company name and tagline prominently displayed.

**Tailwind Notes**:
- Flexbox is used for layout, ensuring responsiveness.
- Padding and margin are carefully applied for spacing.
- Text colors are chosen for high contrast against the background.

```html
<footer class="bg-gray-800 text-white py-8"><div class="container mx-auto flex flex-col md:flex-row justify-between items-center"><div class="mb-4 md:mb-0"><h2 class="text-2xl font-bold">CompanyName</h2><p class="text-sm italic">Your tagline goes here</p></div><div class="flex space-x-4"><a href="#" class="text-gray-400 hover:text-white transition">Privacy Policy</a><a href="#" class="text-gray-400 hover:text-white transition">Terms of Service</a></div></div><div class="text-center mt-4 text-sm">&copy; 2023 CompanyName. All rights reserved.</div></footer>
```

### Example 2: Brand Footer with Quick Links

**When To Use**: Ideal for brands that want to provide quick access to important links while maintaining a minimal aesthetic.

**Why It Works**: The structured layout with columns for links enhances usability while keeping the design clean. The footer is responsive and adapts gracefully to different screen sizes.

**Tailwind Notes**:
- Grid layout is utilized to organize links effectively.
- Hover effects on links improve interactivity.
- Consistent spacing ensures a polished look.

```html
<footer class="bg-white text-gray-800 py-10"><div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"><div class="flex flex-col"><h2 class="text-lg font-bold mb-2">CompanyName</h2><p class="text-sm italic mb-4">Your tagline goes here</p></div><div class="flex flex-col"><h3 class="text-md font-semibold mb-2">Quick Links</h3><a href="#" class="text-gray-600 hover:text-blue-500 transition mb-1">Home</a><a href="#" class="text-gray-600 hover:text-blue-500 transition mb-1">About Us</a><a href="#" class="text-gray-600 hover:text-blue-500 transition mb-1">Services</a></div><div class="flex flex-col"><h3 class="text-md font-semibold mb-2">Contact</h3><a href="#" class="text-gray-600 hover:text-blue-500 transition mb-1">Email Us</a><a href="#" class="text-gray-600 hover:text-blue-500 transition mb-1">Support</a></div></div><div class="text-center mt-6 text-sm">&copy; 2023 CompanyName. All rights reserved.</div></footer>
```

### Example 3: Compact Brand Footer with Social Links

**When To Use**: Best for brands that want to integrate social media presence into their minimal footer design.

**Why It Works**: The inclusion of social media icons enhances engagement while maintaining a clean aesthetic. The compact design works well on mobile devices and keeps the focus on the brand.

**Tailwind Notes**:
- Flexbox is used for alignment of social icons.
- Icons are styled for hover effects to encourage interaction.
- Whitespace is effectively utilized to avoid clutter.

```html
<footer class="bg-gray-900 text-white py-6"><div class="container mx-auto flex flex-col items-center"><h2 class="text-xl font-bold mb-2">CompanyName</h2><p class="text-sm italic mb-4">Your tagline goes here</p><div class="flex space-x-4 mb-4"><a href="#" class="text-gray-400 hover:text-blue-500 transition"><i class="fab fa-facebook-f"></i></a><a href="#" class="text-gray-400 hover:text-blue-500 transition"><i class="fab fa-twitter"></i></a><a href="#" class="text-gray-400 hover:text-blue-500 transition"><i class="fab fa-instagram"></i></a></div><div class="text-center text-xs">&copy; 2023 CompanyName. All rights reserved.</div></div></footer>
```

## `footer` / `brand-story`

### Example 1: Simple Brand Story Footer

**When To Use**: Use this layout for a clean and straightforward brand story presentation, ideal for minimalist brands.

**Why It Works**: The layout emphasizes clarity and brand identity through effective use of typography, spacing, and contrast, making it easy for users to digest the information.

**Tailwind Notes**:
- Utilizes flexbox for responsive alignment.
- Emphasizes the company name and tagline with larger font sizes and bold weights.
- Incorporates a subtle background color for visual separation.

```html
<footer class='bg-gray-100 py-8'><div class='container mx-auto px-4'><h2 class='text-3xl font-bold text-gray-800'>Your Company Name</h2><p class='text-lg text-gray-600 mb-6'>Your inspiring tagline goes here.</p><div class='flex flex-col md:flex-row justify-between'><div class='w-full md:w-1/3'><h3 class='text-xl font-semibold text-gray-800'>About Us</h3><p class='text-gray-600'>Brief description of the company story.</p></div><div class='w-full md:w-1/3'><h3 class='text-xl font-semibold text-gray-800'>Services</h3><ul class='text-gray-600'><li>Service One</li><li>Service Two</li><li>Service Three</li></ul></div><div class='w-full md:w-1/3'><h3 class='text-xl font-semibold text-gray-800'>Contact</h3><p class='text-gray-600'>info@yourcompany.com</p></div></div><p class='mt-8 text-center text-gray-500'>&copy; 2023 Your Company Name. All rights reserved.</p></div></footer>
```

### Example 2: Brand Story with Call to Action

**When To Use**: This layout is perfect for brands looking to engage users with a call to action while sharing their story.

**Why It Works**: The combination of storytelling and a strong CTA creates a compelling narrative that encourages user interaction, supported by clear visual hierarchy and responsive design.

**Tailwind Notes**:
- Highlights the CTA with contrasting colors and ample padding.
- Uses a grid layout for the columns to maintain structure and clarity.
- Incorporates hover effects for links to enhance interactivity.

```html
<footer class='bg-white py-10'><div class='container mx-auto px-6'><h2 class='text-4xl font-bold text-gray-900'>Your Company Name</h2><p class='text-xl text-gray-700 mb-4'>Your inspiring tagline goes here.</p><div class='grid grid-cols-1 md:grid-cols-3 gap-6'><div class='p-4 border rounded-lg shadow hover:shadow-lg transition-shadow'><h3 class='text-lg font-semibold text-gray-800'>Our Story</h3><p class='text-gray-600'>Learn about our journey and mission.</p></div><div class='p-4 border rounded-lg shadow hover:shadow-lg transition-shadow'><h3 class='text-lg font-semibold text-gray-800'>Explore Services</h3><ul class='text-gray-600'><li>Service One</li><li>Service Two</li><li>Service Three</li></ul></div><div class='p-4 border rounded-lg shadow hover:shadow-lg transition-shadow'><h3 class='text-lg font-semibold text-gray-800'>Get in Touch</h3><p class='text-gray-600'>info@yourcompany.com</p></div></div><a href='#' class='mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors'>Join Us</a><p class='mt-8 text-center text-gray-500'>&copy; 2023 Your Company Name. All rights reserved.</p></div></footer>
```

## `footer` / `services-heavy`

### Example 1: Comprehensive Services Footer

**When To Use**: When you want to highlight multiple service offerings in a structured layout.

**Why It Works**: The layout utilizes a grid system to effectively showcase services, ensuring clear hierarchy and easy navigation. The use of contrasting colors enhances readability, while ample spacing provides a clean, organized appearance.

**Tailwind Notes**:
- Grid layout for responsive design using `grid-cols-1 md:grid-cols-3`.
- Clear typography with `text-lg` for service titles and `text-sm` for descriptions.
- Emphasized CTA with a button styled using `bg-blue-600 text-white hover:bg-blue-700`.

```html
<footer class='bg-gray-800 text-white py-12'><div class='container mx-auto px-4'><h2 class='text-2xl font-bold mb-6'>Our Services</h2><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div class='bg-gray-700 p-6 rounded-lg'><h3 class='text-lg font-semibold'>Web Development</h3><p class='text-sm'>Building responsive and engaging websites.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-gray-700 p-6 rounded-lg'><h3 class='text-lg font-semibold'>SEO Optimization</h3><p class='text-sm'>Improving your site's visibility on search engines.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div><div class='bg-gray-700 p-6 rounded-lg'><h3 class='text-lg font-semibold'>Digital Marketing</h3><p class='text-sm'>Strategies to boost your online presence.</p><a href='#' class='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Learn More</a></div></div><div class='mt-10 text-center'><p class='text-sm'>&copy; 2023 Your Company Name. All rights reserved.</p></div></div></footer>
```

### Example 2: Service Overview with Tagline

**When To Use**: When you want to provide a brief overview of services along with a strong company tagline.

**Why It Works**: This example combines a tagline with a concise service list, using bold typography and strategic spacing to create a visually appealing footer. The layout is responsive and maintains clarity on all devices.

**Tailwind Notes**:
- Utilizes flexbox for alignment with `flex flex-col md:flex-row`.
- Strong emphasis on the tagline with `text-xl font-bold`.
- Consistent button styling for CTAs enhances user interaction.

```html
<footer class='bg-gray-900 text-white py-10'><div class='container mx-auto px-4'><h1 class='text-xl font-bold text-center mb-4'>Empowering Your Business</h1><div class='flex flex-col md:flex-row justify-between'><div class='flex-1 mb-4 md:mb-0'><h2 class='text-lg font-semibold'>Our Services</h2><ul class='list-disc list-inside'><li>Custom Software Development</li><li>Mobile App Development</li><li>Cloud Solutions</li></ul></div><div class='flex-1 text-center'><a href='#' class='bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700'>Get Started</a></div></div><div class='mt-6 text-center'><p class='text-sm'>&copy; 2023 Your Company Name. All rights reserved.</p></div></div></footer>
```

## `footer` / `cta-footer`

### Example 1: Simple CTA Footer with Company Info

**When To Use**: When you want to provide essential company information along with a clear call to action.

**Why It Works**: This layout uses a clear hierarchy with a prominent CTA button, ensuring users know what action to take. The use of contrasting colors for the button and background enhances visibility.

**Tailwind Notes**:
- Responsive layout with flexbox for easy alignment.
- Generous padding and margin for breathing space.
- Typography choices enhance readability and hierarchy.

```html
<footer class='bg-gray-800 text-white py-10'><div class='container mx-auto px-4'><div class='flex flex-col md:flex-row justify-between'><div class='mb-6 md:mb-0'><h2 class='text-2xl font-bold'>Your Company Name</h2><p class='text-gray-400'>Empowering your business with innovative solutions.</p></div><div class='flex md:items-center'><a href='#' class='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg'>Get Started</a></div></div><div class='mt-8 text-center text-gray-400'>&copy; 2023 Your Company Name. All rights reserved.</div></div></footer>
```

### Example 2: Multi-Column CTA Footer with Resources

**When To Use**: Ideal for showcasing various resources or links while still emphasizing a primary call to action.

**Why It Works**: The multi-column layout organizes content neatly, making it easy for users to find what they need. The CTA button is still prominent, encouraging user engagement.

**Tailwind Notes**:
- Grid layout for columns provides a structured appearance.
- Hover effects on links improve interactivity.
- Responsive design adapts to different screen sizes.

```html
<footer class='bg-gray-900 text-white py-12'><div class='container mx-auto px-4'><div class='grid grid-cols-1 md:grid-cols-3 gap-8'><div><h3 class='text-lg font-semibold mb-2'>Resources</h3><ul><li><a href='#' class='hover:underline'>Documentation</a></li><li><a href='#' class='hover:underline'>Support</a></li><li><a href='#' class='hover:underline'>Blog</a></li></ul></div><div><h3 class='text-lg font-semibold mb-2'>About Us</h3><ul><li><a href='#' class='hover:underline'>Our Story</a></li><li><a href='#' class='hover:underline'>Careers</a></li><li><a href='#' class='hover:underline'>Contact</a></li></ul></div><div class='flex flex-col justify-center'><h3 class='text-lg font-semibold mb-2'>Join Us</h3><a href='#' class='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full text-center'>Get Started</a></div></div><div class='mt-8 text-center text-gray-400'>&copy; 2023 Your Company Name. All rights reserved.</div></div></footer>
```

### Example 3: Minimalist CTA Footer with Social Links

**When To Use**: Use this layout when you want a clean, modern look that emphasizes social engagement alongside a call to action.

**Why It Works**: The minimalist design reduces clutter and focuses attention on the CTA and social links. The use of icons enhances visual interest and encourages interaction.

**Tailwind Notes**:
- Use of icons for social links adds a modern touch.
- Whitespace balances the layout, preventing it from feeling cramped.
- Simple typography keeps the focus on the message.

```html
<footer class='bg-gray-700 text-white py-8'><div class='container mx-auto px-4'><div class='flex flex-col items-center'><h2 class='text-xl font-bold mb-2'>Your Company Name</h2><p class='text-gray-300 mb-4'>Follow us on social media and stay updated.</p><div class='flex space-x-4 mb-4'><a href='#' class='text-gray-300 hover:text-white'><i class='fab fa-facebook-f'></i></a><a href='#' class='text-gray-300 hover:text-white'><i class='fab fa-twitter'></i></a><a href='#' class='text-gray-300 hover:text-white'><i class='fab fa-instagram'></i></a></div><a href='#' class='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg'>Join Our Newsletter</a></div><div class='mt-6 text-center text-gray-400'>&copy; 2023 Your Company Name. All rights reserved.</div></div></footer>
```

## `footer` / `app-links`

### Example 1: Simple App Links Footer

**When To Use**: Ideal for showcasing essential app links and company information in a clean, straightforward layout.

**Why It Works**: Utilizes clear typography and structured columns for easy navigation, while providing ample spacing for a polished look.

**Tailwind Notes**:
- Flexbox layout for responsive design.
- Consistent padding and margin for visual hierarchy.
- High contrast text for readability.

```html
<footer class="bg-gray-800 text-white py-10">
  <div class="container mx-auto px-6">
    <div class="flex flex-col md:flex-row justify-between">
      <div class="mb-6 md:mb-0">
        <h2 class="text-2xl font-bold">Company Name</h2>
        <p class="text-gray-400">Tagline goes here.</p>
      </div>
      <div class="flex flex-col md:flex-row">
        <div class="md:mr-10">
          <h3 class="font-semibold text-lg mb-2">Links</h3>
          <ul>
            <li><a href="#" class="text-gray-300 hover:text-white">Home</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">About</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Services</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">Resources</h3>
          <ul>
            <li><a href="#" class="text-gray-300 hover:text-white">Blog</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Help Center</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mt-10 border-t border-gray-700 pt-6 text-center">
      <p class="text-gray-400">&copy; 2023 Company Name. All rights reserved.</p>
    </div>
  </div>
</footer>
```

### Example 2: Detailed App Links Footer with Icons

**When To Use**: Best for a more engaging footer that includes icons for visual interest and quick navigation.

**Why It Works**: Combines visual elements with text to create a more dynamic layout, improving user interaction and retention.

**Tailwind Notes**:
- Uses flexbox for alignment and spacing.
- Icons enhance user experience and recognition.
- Hover effects improve interactivity.

```html
<footer class="bg-gray-900 text-white py-12">
  <div class="container mx-auto px-6">
    <div class="flex flex-col md:flex-row justify-between">
      <div class="mb-6 md:mb-0">
        <h2 class="text-3xl font-bold">Company Name</h2>
        <p class="text-gray-400 italic">Your tagline here.</p>
      </div>
      <div class="flex flex-col md:flex-row">
        <div class="md:mr-10 mb-6 md:mb-0">
          <h3 class="font-semibold text-lg mb-2">Explore</h3>
          <ul class="space-y-2">
            <li class="flex items-center"><i class="fas fa-home mr-2"></i><a href="#" class="text-gray-300 hover:text-white">Home</a></li>
            <li class="flex items-center"><i class="fas fa-info-circle mr-2"></i><a href="#" class="text-gray-300 hover:text-white">About</a></li>
            <li class="flex items-center"><i class="fas fa-cogs mr-2"></i><a href="#" class="text-gray-300 hover:text-white">Services</a></li>
            <li class="flex items-center"><i class="fas fa-envelope mr-2"></i><a href="#" class="text-gray-300 hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">Support</h3>
          <ul class="space-y-2">
            <li class="flex items-center"><i class="fas fa-blog mr-2"></i><a href="#" class="text-gray-300 hover:text-white">Blog</a></li>
            <li class="flex items-center"><i class="fas fa-question-circle mr-2"></i><a href="#" class="text-gray-300 hover:text-white">Help Center</a></li>
            <li class="flex items-center"><i class="fas fa-shield-alt mr-2"></i><a href="#" class="text-gray-300 hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mt-10 border-t border-gray-700 pt-6 text-center">
      <p class="text-gray-400">&copy; 2023 Company Name. All rights reserved.</p>
    </div>
  </div>
</footer>
```

## `footer` / `community`

### Example 1: Simple Community Footer with Links

**When To Use**: Use this layout for a straightforward community footer that highlights important links and company info.

**Why It Works**: The use of a grid layout ensures that the columns are evenly spaced and visually appealing. The contrasting colors enhance readability, while the clear hierarchy emphasizes the company name and tagline.

**Tailwind Notes**:
- Grid layout for responsive columns
- Strong contrast for text readability
- Clear spacing for visual separation

```html
<footer class='bg-gray-800 text-white py-10'><div class='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'><div><h3 class='text-lg font-semibold mb-4'>Company Name</h3><p class='text-gray-400'>Your trusted partner in community engagement.</p></div><div><h4 class='text-md font-semibold mb-2'>Resources</h4><ul class='space-y-2'><li><a href='#' class='text-gray-300 hover:text-white'>Blog</a></li><li><a href='#' class='text-gray-300 hover:text-white'>Events</a></li><li><a href='#' class='text-gray-300 hover:text-white'>Support</a></li></ul></div><div><h4 class='text-md font-semibold mb-2'>Connect</h4><ul class='space-y-2'><li><a href='#' class='text-gray-300 hover:text-white'>Twitter</a></li><li><a href='#' class='text-gray-300 hover:text-white'>Facebook</a></li><li><a href='#' class='text-gray-300 hover:text-white'>LinkedIn</a></li></ul></div></div><div class='mt-8 text-center text-gray-500'>&copy; 2023 Company Name. All rights reserved.</div></footer>
```

### Example 2: Community-Focused Footer with Call to Action

**When To Use**: Ideal for a footer that not only provides links but also encourages community engagement through a call to action.

**Why It Works**: The prominent call to action button stands out due to its contrasting background and hover effects. The layout is structured to guide the user’s attention from the company information to the action they can take.

**Tailwind Notes**:
- Use of flexbox for alignment
- CTA button with hover effects
- Consistent spacing for a clean look

```html
<footer class='bg-white text-gray-800 py-10'><div class='container mx-auto flex flex-col md:flex-row justify-between items-start'><div><h3 class='text-xl font-bold'>Company Name</h3><p class='text-gray-600'>Join our community and stay updated!</p></div><div class='mt-4 md:mt-0'><h4 class='text-lg font-semibold mb-2'>Get Involved</h4><p class='mb-4'>Sign up for our newsletter for the latest updates.</p><a href='#' class='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200'>Subscribe Now</a></div><div class='mt-4 md:mt-0'><h4 class='text-lg font-semibold mb-2'>Follow Us</h4><ul class='space-y-2'><li><a href='#' class='text-blue-600 hover:text-blue-800'>Instagram</a></li><li><a href='#' class='text-blue-600 hover:text-blue-800'>YouTube</a></li></ul></div></div><div class='mt-8 text-center text-gray-500'>&copy; 2023 Company Name. All rights reserved.</div></footer>
```

## `footer` / `trust-heavy`

### Example 1: Simple Trust-Focused Footer

**When To Use**: Use this footer when you want to emphasize your company's credibility and provide quick access to important links.

**Why It Works**: The layout is clean and organized, with clear typography and ample spacing that enhances readability. The contrast between the background and text colors ensures that the company name and tagline stand out, while the links are easy to navigate.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs sufficient padding and margin for clarity.
- Strong color contrast for accessibility.

```html
<footer class='bg-gray-800 text-white py-10'><div class='container mx-auto flex flex-col md:flex-row justify-between'><div class='mb-6 md:mb-0'><h2 class='text-2xl font-bold'>CompanyName</h2><p class='text-gray-400'>Your trusted partner in success.</p></div><div class='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-10'><div><h3 class='font-semibold'>Quick Links</h3><ul class='space-y-2'><li><a href='#' class='text-gray-400 hover:text-white'>Home</a></li><li><a href='#' class='text-gray-400 hover:text-white'>About</a></li><li><a href='#' class='text-gray-400 hover:text-white'>Services</a></li></ul></div><div><h3 class='font-semibold'>Support</h3><ul class='space-y-2'><li><a href='#' class='text-gray-400 hover:text-white'>Contact Us</a></li><li><a href='#' class='text-gray-400 hover:text-white'>FAQ</a></li></ul></div></div></div><div class='border-t border-gray-700 mt-10 pt-4 text-center'><p class='text-gray-400'>&copy; 2023 CompanyName. All rights reserved.</p></div></footer>
```

### Example 2: Multi-Column Trust Footer with Social Proof

**When To Use**: Ideal for showcasing social proof and multiple service areas, making it suitable for larger companies or brands.

**Why It Works**: The multi-column layout allows for an organized presentation of information while the social proof elements build trust. The use of icons and clear headings enhances visual hierarchy and engagement.

**Tailwind Notes**:
- Grid layout for responsive columns.
- Incorporates icons for visual interest.
- Consistent padding for uniformity.

```html
<footer class='bg-white text-gray-800 py-10'><div class='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10'><div class='flex flex-col'><h2 class='text-3xl font-bold'>CompanyName</h2><p class='text-gray-600'>Trusted by thousands of clients worldwide.</p></div><div class='flex flex-col'><h3 class='font-semibold'>Services</h3><ul class='space-y-2'><li><a href='#' class='text-gray-700 hover:text-blue-600'>Consulting</a></li><li><a href='#' class='text-gray-700 hover:text-blue-600'>Development</a></li><li><a href='#' class='text-gray-700 hover:text-blue-600'>Design</a></li></ul></div><div class='flex flex-col'><h3 class='font-semibold'>Connect with Us</h3><div class='flex space-x-4'><a href='#' class='text-gray-700 hover:text-blue-600'><i class='fab fa-facebook'></i></a><a href='#' class='text-gray-700 hover:text-blue-600'><i class='fab fa-twitter'></i></a><a href='#' class='text-gray-700 hover:text-blue-600'><i class='fab fa-linkedin'></i></a></div></div></div><div class='border-t border-gray-300 mt-10 pt-4 text-center'><p class='text-gray-500'>&copy; 2023 CompanyName. All rights reserved.</p></div></footer>
```

## `footer` / `map-footer`

### Example 1: Minimalist Map Footer

**When To Use**: Use this design for a clean and modern look, suitable for tech startups or minimalist brands.

**Why It Works**: The layout emphasizes clarity and ease of navigation, while the use of whitespace and contrasting colors enhances readability and focus on the CTA.

**Tailwind Notes**:
- Flexbox is used for layout, ensuring responsiveness.
- Contrast in colors helps the CTA stand out.
- Generous padding provides a spacious feel.

```html
<footer class='bg-gray-800 text-white py-12'><div class='container mx-auto flex flex-col md:flex-row justify-between'><div class='mb-6 md:mb-0'><h2 class='text-2xl font-bold'>CompanyName</h2><p class='text-gray-400'>{tagline}</p></div><div class='flex flex-col md:flex-row md:space-x-10'><div class='flex-1'><h3 class='text-lg font-semibold'>Navigation</h3><ul class='mt-4 space-y-2'><li><a href='#' class='text-gray-300 hover:text-white'>Home</a></li><li><a href='#' class='text-gray-300 hover:text-white'>About</a></li><li><a href='#' class='text-gray-300 hover:text-white'>Services</a></li></ul></div><div class='flex-1'><h3 class='text-lg font-semibold'>Contact</h3><ul class='mt-4 space-y-2'><li><a href='#' class='text-gray-300 hover:text-white'>Email Us</a></li><li><a href='#' class='text-gray-300 hover:text-white'>Support</a></li></ul></div></div></div><div class='border-t border-gray-700 mt-8 pt-4 text-center'><p class='text-gray-500'>&copy; {copyrightYear} CompanyName. All rights reserved.</p></div></footer>
```

### Example 2: Vibrant Map Footer with CTA

**When To Use**: Ideal for brands that want to make a bold statement and encourage user engagement through prominent CTAs.

**Why It Works**: The vibrant background and large CTA button create visual interest and drive user action, while the structured layout keeps information clear and accessible.

**Tailwind Notes**:
- The use of a bright background color creates a strong visual anchor.
- Larger font sizes for headings enhance hierarchy.
- The CTA button is styled to be prominent and inviting.

```html
<footer class='bg-blue-600 text-white py-12'><div class='container mx-auto flex flex-col md:flex-row justify-between'><div class='mb-6 md:mb-0'><h2 class='text-3xl font-bold'>CompanyName</h2><p class='text-gray-200'>{tagline}</p></div><div class='flex flex-col md:flex-row md:space-x-10'><div class='flex-1'><h3 class='text-lg font-semibold'>Explore</h3><ul class='mt-4 space-y-2'><li><a href='#' class='hover:text-gray-200'>Features</a></li><li><a href='#' class='hover:text-gray-200'>Pricing</a></li><li><a href='#' class='hover:text-gray-200'>Blog</a></li></ul></div><div class='flex-1'><h3 class='text-lg font-semibold'>Connect</h3><ul class='mt-4 space-y-2'><li><a href='#' class='hover:text-gray-200'>Social Media</a></li><li><a href='#' class='hover:text-gray-200'>Contact Us</a></li></ul></div></div></div><div class='text-center mt-8'><a href='#' class='bg-white text-blue-600 font-semibold py-2 px-6 rounded shadow hover:bg-gray-200 transition'>Get Started</a></div><div class='border-t border-blue-500 mt-8 pt-4 text-center'><p class='text-gray-300'>&copy; {copyrightYear} CompanyName. All rights reserved.</p></div></footer>
```

## `footer` / `directory-style`

### Example 1: Simple Directory Footer

**When To Use**: Use this layout for a clean, straightforward footer that provides essential links and information without overwhelming the user.

**Why It Works**: The use of a clean grid layout with clear typography and ample spacing creates an organized look. The contrasting colors help important information stand out, while the responsive design ensures usability on all devices.

**Tailwind Notes**:
- Grid layout for column organization
- Responsive typography for readability
- Clear call-to-action with contrasting button

```html
<footer class="bg-gray-800 text-white py-10">
  <div class="container mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h2 class="text-xl font-bold mb-4">Company Name</h2>
        <p class="text-gray-400">Your trusted partner in innovation.</p>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-2">Quick Links</h3>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-300 hover:text-white">Home</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">About Us</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Services</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-2">Follow Us</h3>
        <ul class="flex space-x-4">
          <li><a href="#" class="text-gray-300 hover:text-white">Facebook</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Twitter</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Instagram</a></li>
        </ul>
      </div>
    </div>
    <div class="mt-10 text-center text-gray-400">
      <p>&copy; 2023 Company Name. All rights reserved.</p>
    </div>
  </div>
</footer>
```

### Example 2: Detailed Directory Footer with Call-to-Action

**When To Use**: Use this layout when you want to encourage user engagement with a clear call-to-action alongside directory links.

**Why It Works**: The structured grid allows for easy navigation while the prominent call-to-action button draws attention. The contrasting colors and spacing create a visually appealing layout that enhances user experience.

**Tailwind Notes**:
- Prominent CTA button for engagement
- Clear hierarchy with headings and lists
- Responsive design for mobile and desktop

```html
<footer class="bg-gray-900 text-white py-12">
  <div class="container mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h2 class="text-2xl font-bold mb-4">Company Name</h2>
        <p class="text-gray-400">Innovating for a better tomorrow.</p>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-2">Services</h3>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-300 hover:text-white">Consulting</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Development</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Design</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-2">Resources</h3>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-300 hover:text-white">Blog</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">Case Studies</a></li>
          <li><a href="#" class="text-gray-300 hover:text-white">FAQs</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-2">Get In Touch</h3>
        <p class="text-gray-300 mb-4">Subscribe to our newsletter for updates.</p>
        <a href="#" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Subscribe</a>
      </div>
    </div>
    <div class="mt-10 text-center text-gray-400">
      <p>&copy; 2023 Company Name. All rights reserved.</p>
    </div>
  </div>
</footer>
```

## `footer` / `split-footer`

### Example 1: Modern Corporate Footer

**When To Use**: Ideal for corporate websites that want to convey professionalism and clarity.

**Why It Works**: The use of a two-column layout with clear typography and ample spacing enhances readability and visual hierarchy, while the contrasting background color and text styles draw attention to key areas.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Employs consistent spacing for a polished look.
- Strong contrast for accessibility and emphasis on CTAs.

```html
<footer class="bg-gray-800 text-white py-10"><div class="container mx-auto flex flex-col md:flex-row justify-between"><div class="mb-6 md:mb-0"><h2 class="text-2xl font-bold">CompanyName</h2><p class="text-gray-400">Your trusted partner in business.</p></div><div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-10"><div><h3 class="font-semibold text-lg">Quick Links</h3><ul class="space-y-2"><li><a href="#" class="text-gray-300 hover:text-white">Home</a></li><li><a href="#" class="text-gray-300 hover:text-white">About Us</a></li><li><a href="#" class="text-gray-300 hover:text-white">Services</a></li></ul></div><div><h3 class="font-semibold text-lg">Contact</h3><ul class="space-y-2"><li><a href="#" class="text-gray-300 hover:text-white">Email</a></li><li><a href="#" class="text-gray-300 hover:text-white">Phone</a></li><li><a href="#" class="text-gray-300 hover:text-white">Support</a></li></ul></div></div></div><div class="border-t border-gray-700 mt-10 pt-6 text-center"><p class="text-gray-400">© 2023 CompanyName. All rights reserved.</p></div></footer>
```

### Example 2: E-commerce Footer with Emphasis on CTAs

**When To Use**: Best for e-commerce sites that want to engage users and drive conversions.

**Why It Works**: The layout prioritizes call-to-action elements alongside informative links, ensuring users can easily navigate while being encouraged to subscribe or shop.

**Tailwind Notes**:
- Highlights CTAs with distinct colors and spacing.
- Uses a grid layout for product categories for better organization.
- Responsive design adjusts layout based on screen size.

```html
<footer class="bg-white text-gray-800 py-12"><div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"><div class="flex flex-col"><h2 class="text-2xl font-bold mb-4">CompanyName</h2><p class="text-gray-600 mb-4">Your go-to for the latest trends.</p><a href="#" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Subscribe to Newsletter</a></div><div class="flex flex-col"><h3 class="font-semibold text-lg mb-2">Shop</h3><ul class="space-y-2"><li><a href="#" class="text-gray-600 hover:text-blue-600">Men</a></li><li><a href="#" class="text-gray-600 hover:text-blue-600">Women</a></li><li><a href="#" class="text-gray-600 hover:text-blue-600">Accessories</a></li></ul></div><div class="flex flex-col"><h3 class="font-semibold text-lg mb-2">Customer Service</h3><ul class="space-y-2"><li><a href="#" class="text-gray-600 hover:text-blue-600">Help Center</a></li><li><a href="#" class="text-gray-600 hover:text-blue-600">Returns</a></li><li><a href="#" class="text-gray-600 hover:text-blue-600">Contact Us</a></li></ul></div></div><div class="border-t border-gray-300 mt-8 pt-6 text-center"><p class="text-gray-500">© 2023 CompanyName. All rights reserved.</p></div></footer>
```

## `footer` / `stacked-footer`

### Example 1: Simple Corporate Footer

**When To Use**: Use this when you want to convey a professional image with clear navigation and branding.

**Why It Works**: This implementation uses clear typography and strong contrast to enhance readability while providing a structured layout for easy navigation.

**Tailwind Notes**:
- Utilizes flexbox for responsive layout.
- Incorporates ample padding for a spacious feel.
- Uses contrasting colors for text and background to improve legibility.

```html
<footer class="bg-gray-800 text-white py-8"><div class="container mx-auto px-4"><div class="flex flex-col md:flex-row justify-between"><div class="mb-4 md:mb-0"><h2 class="text-xl font-bold">Company Name</h2><p class="text-gray-400">Your tagline goes here.</p></div><div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8"><div><h3 class="font-semibold">Navigation</h3><ul class="space-y-2"><li><a href="#" class="hover:text-gray-300">Home</a></li><li><a href="#" class="hover:text-gray-300">About</a></li><li><a href="#" class="hover:text-gray-300">Services</a></li><li><a href="#" class="hover:text-gray-300">Contact</a></li></ul></div><div><h3 class="font-semibold">Follow Us</h3><ul class="space-y-2"><li><a href="#" class="hover:text-gray-300">Facebook</a></li><li><a href="#" class="hover:text-gray-300">Twitter</a></li><li><a href="#" class="hover:text-gray-300">Instagram</a></li></ul></div></div></div><div class="mt-8 text-center text-gray-500">© 2023 Company Name. All rights reserved.</div></div></footer>
```

### Example 2: Creative Agency Footer

**When To Use**: Ideal for creative agencies wanting to showcase services and social links in a visually appealing manner.

**Why It Works**: The use of cards for service links and a vibrant color palette draws attention while maintaining a clean layout that encourages user interaction.

**Tailwind Notes**:
- Employs card design for service links to create visual interest.
- Uses a grid layout for responsiveness and organization.
- Incorporates hover effects for interactive elements.

```html
<footer class="bg-white text-gray-800 py-10"><div class="container mx-auto px-6"><div class="flex flex-col md:flex-row justify-between"><div class="mb-6 md:mb-0"><h2 class="text-2xl font-bold">Company Name</h2><p class="text-gray-600">Innovative solutions for your business.</p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="bg-gray-100 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"><h3 class="font-semibold">Our Services</h3><ul class="space-y-2"><li><a href="#" class="text-blue-600 hover:underline">Web Design</a></li><li><a href="#" class="text-blue-600 hover:underline">Branding</a></li><li><a href="#" class="text-blue-600 hover:underline">Marketing</a></li></ul></div><div class="bg-gray-100 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"><h3 class="font-semibold">Connect with Us</h3><ul class="space-y-2"><li><a href="#" class="text-blue-600 hover:underline">LinkedIn</a></li><li><a href="#" class="text-blue-600 hover:underline">Twitter</a></li><li><a href="#" class="text-blue-600 hover:underline">Dribbble</a></li></ul></div><div class="bg-gray-100 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"><h3 class="font-semibold">Resources</h3><ul class="space-y-2"><li><a href="#" class="text-blue-600 hover:underline">Blog</a></li><li><a href="#" class="text-blue-600 hover:underline">Case Studies</a></li><li><a href="#" class="text-blue-600 hover:underline">FAQs</a></li></ul></div></div></div><div class="mt-8 text-center text-gray-500">© 2023 Company Name. All rights reserved.</div></div></footer>
```

## `footer` / `centered-footer`

### Example 1: Simple Centered Footer

**When To Use**: Use this example for a clean, minimalist footer that emphasizes branding and a clear call to action.

**Why It Works**: The layout is straightforward, allowing users to easily identify the company and its purpose. The use of contrasting colors for the CTA button ensures it stands out.

**Tailwind Notes**:
- Utilizes flexbox for alignment and centering.
- Incorporates responsive utilities for mobile optimization.
- Emphasizes typography for better readability.

```html
<footer class='bg-gray-800 text-white py-8'><div class='container mx-auto text-center'><h2 class='text-2xl font-bold mb-2'>Your Company Name</h2><p class='text-gray-400 mb-4'>Your tagline goes here</p><div class='flex justify-center space-x-4 mb-4'><a href='#' class='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded'>Get Started</a><a href='#' class='text-blue-400 hover:underline'>Learn More</a></div><div class='flex justify-center space-x-8 mt-4'><span class='text-gray-400'>Column 1</span><span class='text-gray-400'>Column 2</span><span class='text-gray-400'>Column 3</span></div><p class='text-gray-500 mt-4'>&copy; 2023 Your Company. All rights reserved.</p></div></footer>
```

### Example 2: Rich Centered Footer with Links

**When To Use**: This example is suitable for businesses that want to provide additional navigation links in the footer while maintaining a polished look.

**Why It Works**: The footer is well-structured with clear sections for links and information, enhancing usability. The use of color contrast helps in guiding the user's attention.

**Tailwind Notes**:
- Organizes content into columns for better readability.
- Uses hover effects to enhance interactivity.
- Employs responsive design for various screen sizes.

```html
<footer class='bg-gray-900 text-white py-12'><div class='container mx-auto text-center'><h2 class='text-3xl font-bold mb-3'>Your Company Name</h2><p class='text-gray-400 mb-5'>Innovating your world, one step at a time.</p><div class='grid grid-cols-2 md:grid-cols-4 gap-6 mb-6'><div><h3 class='font-semibold mb-2'>Products</h3><ul class='space-y-2'><li><a href='#' class='text-gray-300 hover:text-blue-400'>Product 1</a></li><li><a href='#' class='text-gray-300 hover:text-blue-400'>Product 2</a></li><li><a href='#' class='text-gray-300 hover:text-blue-400'>Product 3</a></li></ul></div><div><h3 class='font-semibold mb-2'>Company</h3><ul class='space-y-2'><li><a href='#' class='text-gray-300 hover:text-blue-400'>About Us</a></li><li><a href='#' class='text-gray-300 hover:text-blue-400'>Careers</a></li><li><a href='#' class='text-gray-300 hover:text-blue-400'>Contact</a></li></ul></div><div><h3 class='font-semibold mb-2'>Support</h3><ul class='space-y-2'><li><a href='#' class='text-gray-300 hover:text-blue-400'>Help Center</a></li><li><a href='#' class='text-gray-300 hover:text-blue-400'>Privacy Policy</a></li><li><a href='#' class='text-gray-300 hover:text-blue-400'>Terms of Service</a></li></ul></div><div><h3 class='font-semibold mb-2'>Follow Us</h3><ul class='space-y-2'><li><a href='#' class='text-gray-300 hover:text-blue-400'>Twitter</a></li><li><a href='#' class='text-gray-300 hover:text-blue-400'>Facebook</a></li><li><a href='#' class='text-gray-300 hover:text-blue-400'>Instagram</a></li></ul></div></div><p class='text-gray-500 mt-4'>&copy; 2023 Your Company. All rights reserved.</p></div></footer>
```

### Example 3: Compact Centered Footer with CTA

**When To Use**: Ideal for startups or projects that want to encourage newsletter sign-ups while keeping the footer concise.

**Why It Works**: The combination of a clear call to action and minimal text helps focus user attention. The layout is compact, ensuring it fits well on smaller screens.

**Tailwind Notes**:
- Uses a single-column layout for mobile-first design.
- Highlights the CTA with distinct colors and spacing.
- Maintains readability with appropriate font sizes.

```html
<footer class='bg-gray-700 text-white py-10'><div class='container mx-auto text-center'><h2 class='text-2xl font-bold mb-3'>Join Our Community</h2><p class='text-gray-300 mb-4'>Stay updated with our latest news and offers.</p><form class='flex justify-center mb-4'><input type='email' placeholder='Your email address' class='p-2 rounded-l-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' /><button type='submit' class='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-r-lg'>Subscribe</button></form><p class='text-gray-400'>&copy; 2023 Your Company. All rights reserved.</p></div></footer>
```
