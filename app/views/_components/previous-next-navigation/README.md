# Previous and next navigation

Displays links that allow users to navigate between a series of pages or elements.

This component accepts 2 optional parameters, previous and next.

Each optional parameter accepts:

- an URL for the link
- a title for the URL
- a label that can add extra info (ie page number) that will be displayed under the title

If one of the 2 parameters is nil, no link will appear.

[Preview the component](https://govuk-website-prototype.herokuapp.com/components/previous-next-navigation/)

## Example usage

```
{{ appPreviousNextNavigation({
  previous: {
    href: '#',
    title: {
      text: 'Previous page'
    },
    label: {
      text: 'Lorem ipsum dolor sit amet'
    }
  },
  next: {
    href: '#',
    title: {
      text: 'Next page'
    },
    label: {
      text: 'Consectetur adipiscing elit'
    }
  }
}) }}
```

## Accessibility acceptance criteria

Icons in the component must not be announced by screen readers.

The component must:

- identify itself as pagination navigation
- provide a distinction between the navigation text and label text of the links both visually and for screen readers

Links in the component must:

- accept focus
- be focusable with a keyboard
- be usable with a keyboard
- indicate when they have focus
- change in appearance when touched (in the touch-down state)
- change in appearance when hovered
- be usable with touch
- be usable with [voice commands](https://www.w3.org/WAI/perspectives/voice.html)
- have visible text

## Arguments

This component accepts the following arguments.

|Name|Type|Required|Description|
|---|---|---|---|
|role|string|No|Default is ‘navigation’|
|next|object|Yes|Options for the next element. See [previous and next](#previous-and-next)|
|previous|object|Yes|Options for the previous element. See [previous and next](#previous-and-next)|
|classes|string|No|Classes to add to the container.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the container.|

### Previous and next

|Name|Type|Required|Description|
|---|---|---|---|
|href|string|Yes|The URL of the previous or next page or _thing_. Not required if there is no next or previous page or _thing_.|
|title|object|Yes|Options for the title element (for example ‘Next page’). See [title](#title)|
|label|object|Yes|Options for the label element (for example the title of the linked to page or _thing_). See [label](#label)|
|rel|string|No|The relationship of the linked URL. Defaults to ‘next’ for the next link and ‘previous’ for the previous link.|
|classes|string|No|Classes to add to the list item.|
|attributes|object|No|HTML attributes (for example data attributes) to add to the list item.|

#### Title

|Name|Type|Required|Description|
|---|---|---|---|
|text|string|Yes|If `html` is set, this is not required. Text to use within the title. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use within the title. If `html` is provided, the `text` argument will be ignored.|

#### Label

|Name|Type|Required|Description|
|---|---|---|---|
|text|string|Yes|If `html` is set, this is not required. Text to use within the label. If `html` is provided, the `text` argument will be ignored.|
|html|string|Yes|If `text` is set, this is not required. HTML to use within the label. If `html` is provided, the `text` argument will be ignored.|

*Warning: If you’re using Nunjucks macros in production be aware that using HTML arguments, or ones ending with `.html` can be at risk from [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. More information about security vulnerabilities can be found in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).*
